/**
 * 楽天トラベルのURLからhotelIdを抽出
 * URL形式: hotelinfo/plan/{hotelId} または hotelinfo/plan/{hotelId}?...
 */
export function extractHotelIdFromRakutenUrl(url: string): string | null {
  try {
    const match = url.match(/hotelinfo\/plan\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * 日付文字列（ISO 8601形式）から年・月・日を抽出
 */
function parseDate(dateStr: string): {
  year: number;
  month: number;
  day: number;
} | null {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // 0-indexedなので+1
      day: date.getDate(),
    };
  } catch {
    return null;
  }
}

/**
 * 楽天トラベルのプランURLを構築（hotelIdから）
 */
export function buildRakutenPlanUrl(
  hotelId: string,
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  childCount?: number | null
): string {
  const baseUrl = `https://hotel.travel.rakuten.co.jp/hotelinfo/plan/${hotelId}`;
  const params = buildRakutenQueryParams(
    checkInDate,
    checkOutDate,
    roomCount,
    adultCount,
    childCount
  );
  return `${baseUrl}?${params}`;
}

/**
 * 楽天トラベルのプランURLにクエリパラメータを追加
 */
export function addQueryParamsToRakutenPlanUrl(
  planUrl: string,
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  childCount?: number | null
): string {
  try {
    const url = new URL(planUrl);
    const params = buildRakutenQueryParams(
      checkInDate,
      checkOutDate,
      roomCount,
      adultCount,
      childCount
    );

    // 既存のクエリパラメータを保持しつつ、新しいパラメータを追加
    const newParams = new URLSearchParams(params);
    for (const [key, value] of newParams.entries()) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  } catch {
    // URLパースに失敗した場合は元のURLを返す
    return planUrl;
  }
}

/**
 * 楽天トラベルのクエリパラメータを構築
 */
function buildRakutenQueryParams(
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  childCount?: number | null
): string {
  const checkIn = parseDate(checkInDate);
  const checkOut = parseDate(checkOutDate);

  const params = new URLSearchParams();

  // 基本パラメータ
  params.set("f_flg", "PLAN");
  params.set("f_teikei", "");
  params.set("f_hizuke", "");
  params.set("f_hak", "");
  params.set("f_dai", "japan");
  params.set("f_chu", "");
  params.set("f_shou", "");
  params.set("f_sai", "");
  params.set("f_tel", "");
  params.set("f_target_flg", "");
  params.set("f_tscm_flg", "");
  params.set("f_p_no", "");
  params.set("f_custom_code", "");
  params.set("f_search_type", "");
  params.set("f_camp_id", "");
  params.set("f_static", "1");
  params.set("f_rm_equip", "");

  // チェックイン日
  if (checkIn) {
    params.set("f_hi1", String(checkIn.day));
    params.set("f_tuki1", String(checkIn.month));
    params.set("f_nen1", String(checkIn.year));
  }

  // チェックアウト日
  if (checkOut) {
    params.set("f_hi2", String(checkOut.day));
    params.set("f_tuki2", String(checkOut.month));
    params.set("f_nen2", String(checkOut.year));
  }

  // 部屋数（デフォルト: 1）
  params.set("f_heya_su", String(roomCount || 1));

  // 大人数（デフォルト: 1）
  params.set("f_otona_su", String(adultCount || 1));

  // 子供（小学生高学年・低学年、デフォルト: 0）
  params.set("f_s1", "0");
  params.set("f_s2", "0");

  // 幼児の各種設定（デフォルト: 0）
  params.set("f_y1", "0");
  params.set("f_y2", "0");
  params.set("f_y3", "0");
  params.set("f_y4", "0");

  params.set("f_kin2", "0");
  params.set("f_kin", "");

  return params.toString();
}

/**
 * 楽天トラベル施設検索APIを使って施設IDからroomThumbnailUrlを取得
 */
export async function fetchRakutenRoomThumbnailUrl(
  hotelId: string
): Promise<string | null> {
  try {
    const applicationId = process.env.RAKUTEN_APPLICATION_ID;
    if (!applicationId) {
      console.warn("RAKUTEN_APPLICATION_ID is not set");
      return null;
    }

    const apiUrl = new URL(
      "https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426"
    );
    apiUrl.searchParams.set("applicationId", applicationId);
    apiUrl.searchParams.set("format", "json");
    apiUrl.searchParams.set("formatVersion", "2");
    apiUrl.searchParams.set("hotelNo", hotelId);
    // 必要なフィールドのみ取得（パフォーマンス向上）
    apiUrl.searchParams.set(
      "elements",
      "hotelNo,hotelImageUrl,hotelThumbnailUrl,roomThumbnailUrl"
    );

    const response = await fetch(apiUrl.toString(), {
      headers: {
        "User-Agent": "tra-bell/1.0",
      },
    });

    if (!response.ok) {
      console.error(
        `Rakuten API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    // APIレスポンスの構造を確認
    // formatVersion=2の場合、itemsは配列で、各要素は直接フィールドを持つ
    if (
      data.hotels &&
      Array.isArray(data.hotels) &&
      data.hotels[0].length > 0
    ) {
      const hotel = data.hotels[0][0].hotelBasicInfo;

      // roomThumbnailUrlを優先、なければhotelThumbnailUrl、それもなければhotelImageUrl
      return (
        hotel.hotelImageUrl ||
        hotel.roomThumbnailUrl ||
        hotel.hotelThumbnailUrl ||
        null
      );
    }

    return null;
  } catch (error) {
    console.error("Error fetching Rakuten room thumbnail URL:", error);
    return null;
  }
}
