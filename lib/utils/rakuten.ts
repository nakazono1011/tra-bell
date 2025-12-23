/**
 * 楽天トラベルのURLからhotelIdを抽出
 * URL形式: hotelinfo/plan/{hotelId} または hotelinfo/plan/{hotelId}?...
 */
export function extractHotelIdFromRakutenUrl(
  url: string
): string | null {
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
 * URLにクエリパラメータを追加する共通処理
 */
function addQueryParamsToUrl(
  urlString: string,
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  childCount?: number | null
): string {
  try {
    const url = new URL(urlString);
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
    return urlString;
  }
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
  return addQueryParamsToUrl(
    planUrl,
    checkInDate,
    checkOutDate,
    roomCount,
    adultCount,
    childCount
  );
}

/**
 * 楽天トラベルのクエリパラメータを構築
 */
function buildRakutenQueryParams(
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  _childCount?: number | null // 将来の拡張用、現在は未使用
): string {
  const checkIn = parseDate(checkInDate);
  const checkOut = parseDate(checkOutDate);

  const params = new URLSearchParams();

  // 基本パラメータ
  params.set('f_flg', 'PLAN');
  params.set('f_teikei', '');
  params.set('f_hizuke', '');
  params.set('f_hak', '');
  params.set('f_dai', 'japan');
  params.set('f_chu', '');
  params.set('f_shou', '');
  params.set('f_sai', '');
  params.set('f_tel', '');
  params.set('f_target_flg', '');
  params.set('f_tscm_flg', '');
  params.set('f_p_no', '');
  params.set('f_custom_code', '');
  params.set('f_search_type', '');
  params.set('f_camp_id', '');
  params.set('f_static', '1');
  params.set('f_rm_equip', '');

  // チェックイン日
  if (checkIn) {
    params.set('f_hi1', String(checkIn.day));
    params.set('f_tuki1', String(checkIn.month));
    params.set('f_nen1', String(checkIn.year));
  }

  // チェックアウト日
  if (checkOut) {
    params.set('f_hi2', String(checkOut.day));
    params.set('f_tuki2', String(checkOut.month));
    params.set('f_nen2', String(checkOut.year));
  }

  // 部屋数（デフォルト: 1）
  params.set('f_heya_su', String(roomCount || 1));

  // 大人数（デフォルト: 1）
  params.set('f_otona_su', String(adultCount || 1));

  // 子供（小学生高学年・低学年、デフォルト: 0）
  params.set('f_s1', '0');
  params.set('f_s2', '0');

  // 幼児の各種設定（デフォルト: 0）
  params.set('f_y1', '0');
  params.set('f_y2', '0');
  params.set('f_y3', '0');
  params.set('f_y4', '0');

  params.set('f_kin2', '0');
  params.set('f_kin', '');

  return params.toString();
}

/**
 * 日付文字列（ISO 8601形式）をYYYY-MM-DD形式に変換
 */
function formatDateForApi(dateStr: string): string | null {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      '0'
    );
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
}

/**
 * 楽天APIの環境変数をチェック
 */
function getRakutenApiCredentials(): {
  applicationId: string | null;
  affiliateId: string | null;
} {
  return {
    applicationId:
      process.env.RAKUTEN_APPLICATION_ID || null,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID || null,
  };
}

/**
 * 楽天APIを呼び出す共通処理
 */
async function callRakutenApi(
  endpoint: string,
  params: Record<string, string>
): Promise<Record<string, unknown> | null> {
  try {
    const { applicationId } = getRakutenApiCredentials();
    if (!applicationId) {
      console.warn('RAKUTEN_APPLICATION_ID is not set');
      return null;
    }

    const apiUrl = new URL(endpoint);
    apiUrl.searchParams.set('applicationId', applicationId);
    apiUrl.searchParams.set('format', 'json');
    apiUrl.searchParams.set('formatVersion', '2');

    // 追加パラメータを設定
    for (const [key, value] of Object.entries(params)) {
      apiUrl.searchParams.set(key, value);
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'User-Agent': 'tra-bell/1.0',
      },
    });

    if (!response.ok) {
      console.error(
        `Rakuten API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Rakuten API:', error);
    return null;
  }
}

/**
 * アフィリエイトURLのpcパラメータ内のURLにクエリパラメータを追加
 * @param affiliateUrl アフィリエイトURL
 * @param checkInDate チェックイン日（ISO 8601形式）
 * @param checkOutDate チェックアウト日（ISO 8601形式）
 * @param roomCount 部屋数
 * @param adultCount 大人数
 * @param childCount 子供数（オプション）
 * @returns クエリパラメータが追加されたアフィリエイトURL
 */
function addQueryParamsToAffiliateUrl(
  affiliateUrl: string,
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  childCount?: number | null
): string {
  try {
    const url = new URL(affiliateUrl);
    const pcParam = url.searchParams.get('pc');

    if (!pcParam) {
      // pcパラメータがない場合は元のURLを返す
      return affiliateUrl;
    }

    // pcパラメータをデコードしてクエリパラメータを追加
    const decodedPcUrl = decodeURIComponent(pcParam);
    const updatedPcUrl = addQueryParamsToUrl(
      decodedPcUrl,
      checkInDate,
      checkOutDate,
      roomCount,
      adultCount,
      childCount
    );

    // pcパラメータに設定（URLSearchParams.set()は自動的にエンコードする）
    url.searchParams.set('pc', updatedPcUrl);

    return url.toString();
  } catch (error) {
    console.error(
      'Error adding query params to affiliate URL:',
      error
    );
    // エラーが発生した場合は元のURLを返す
    return affiliateUrl;
  }
}

/**
 * 楽天トラベル空室検索APIを使ってアフィリエイトURLを取得
 * @param hotelId 施設番号
 * @param checkInDate チェックイン日（ISO 8601形式）
 * @param checkOutDate チェックアウト日（ISO 8601形式）
 * @param roomCount 部屋数
 * @param adultCount 大人数
 * @param childCount 子供数（オプション、現在は未使用）
 * @returns アフィリエイトURL（planListUrl）、取得失敗時はnull
 */
export async function fetchRakutenAffiliateUrl(
  hotelId: string,
  checkInDate: string,
  checkOutDate: string,
  roomCount?: number | null,
  adultCount?: number | null,
  _childCount?: number | null // 将来の拡張用、現在は未使用
): Promise<string | null> {
  try {
    const { affiliateId } = getRakutenApiCredentials();

    // アフィリエイトIDが設定されていない場合はnullを返す
    if (!affiliateId) {
      console.warn(
        'RAKUTEN_AFFILIATE_ID is not set, affiliate URL will not be generated'
      );
      return null;
    }

    const checkIn = formatDateForApi(checkInDate);
    const checkOut = formatDateForApi(checkOutDate);

    if (!checkIn || !checkOut) {
      console.error(
        'Invalid date format for checkInDate or checkOutDate'
      );
      return null;
    }

    const params: Record<string, string> = {
      affiliateId,
      hotelNo: hotelId,
      checkinDate: checkIn,
      checkoutDate: checkOut,
      adultNum: String(adultCount || 1),
      elements: 'planListUrl',
    };

    // 部屋数が指定されている場合は設定
    if (roomCount) {
      params.roomNum = String(roomCount);
    }

    const data = await callRakutenApi(
      'https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426',
      params
    );

    if (!data) {
      return null;
    }

    // formatVersion=2の場合のレスポンス構造
    // hotels配列の最初の要素からplanListUrlを取得
    const hotels = data.hotels as unknown;
    if (
      hotels &&
      Array.isArray(hotels) &&
      hotels.length > 0 &&
      Array.isArray(hotels[0]) &&
      hotels[0].length > 0
    ) {
      const hotel = hotels[0][0] as {
        hotelBasicInfo?: { planListUrl?: string };
      };

      // planListUrlを取得（アフィリエイトIDが設定されている場合、アフィリエイトURLが返される）
      // レスポンス構造: hotel.hotelBasicInfo.planListUrl
      if (hotel.hotelBasicInfo?.planListUrl) {
        const baseAffiliateUrl =
          hotel.hotelBasicInfo.planListUrl;

        // pcパラメータ内のURLにクエリパラメータを追加
        return addQueryParamsToAffiliateUrl(
          baseAffiliateUrl,
          checkInDate,
          checkOutDate,
          roomCount,
          adultCount,
          _childCount
        );
      }
    }

    return null;
  } catch (error) {
    console.error(
      'Error fetching Rakuten affiliate URL:',
      error
    );
    return null;
  }
}

/**
 * 楽天トラベル施設検索APIを使って施設IDからroomThumbnailUrlを取得
 */
export async function fetchRakutenRoomThumbnailUrl(
  hotelId: string
): Promise<string | null> {
  try {
    const data = await callRakutenApi(
      'https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426',
      {
        hotelNo: hotelId,
        elements:
          'hotelNo,hotelImageUrl,hotelThumbnailUrl,roomThumbnailUrl',
      }
    );

    if (!data) {
      return null;
    }

    // APIレスポンスの構造を確認
    // formatVersion=2の場合、itemsは配列で、各要素は直接フィールドを持つ
    const hotels = data.hotels as unknown;
    if (
      hotels &&
      Array.isArray(hotels) &&
      hotels.length > 0 &&
      Array.isArray(hotels[0]) &&
      hotels[0].length > 0
    ) {
      const hotelBasicInfo = (
        hotels[0][0] as { hotelBasicInfo?: unknown }
      ).hotelBasicInfo as
        | {
            hotelImageUrl?: string;
            roomThumbnailUrl?: string;
            hotelThumbnailUrl?: string;
          }
        | undefined;

      if (!hotelBasicInfo) {
        return null;
      }

      // roomThumbnailUrlを優先、なければhotelThumbnailUrl、それもなければhotelImageUrl
      return (
        hotelBasicInfo.hotelImageUrl ||
        hotelBasicInfo.roomThumbnailUrl ||
        hotelBasicInfo.hotelThumbnailUrl ||
        null
      );
    }

    return null;
  } catch (error) {
    console.error(
      'Error fetching Rakuten room thumbnail URL:',
      error
    );
    return null;
  }
}
