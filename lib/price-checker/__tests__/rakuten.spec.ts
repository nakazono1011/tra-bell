import { test, expect } from '@playwright/test';
import { scrollPageGradually } from '../rakuten';

const RAKUTEN_PLAN_URL =
  'https://hotel.travel.rakuten.co.jp/hotelinfo/plan/?f_no=1679&f_flg=PLAN&f_teikei=&f_hizuke=&f_hak=&f_dai=japan&f_chu=&f_shou=&f_sai=&f_tel=&f_target_flg=&f_tscm_flg=&f_p_no=&f_custom_code=&f_search_type=&f_camp_id=&f_static=1&f_rm_equip=&f_hi1=10&f_tuki1=2&f_nen1=2026&f_hi2=11&f_tuki2=2&f_nen2=2026&f_heya_su=1&f_otona_su=1&f_s1=0&f_s2=0&f_y1=0&f_y2=0&f_y3=0&f_y4=0&f_kin2=0&f_kin=';

test.describe('楽天トラベル価格チェッカー', () => {
  test('楽天トラベルの予約ページを開ける', async ({
    page,
  }) => {
    // ページを開く
    await page.goto(RAKUTEN_PLAN_URL, {
      timeout: 60000,
      waitUntil: 'domcontentloaded',
    });

    // ページが正しく読み込まれたか確認
    await scrollPageGradually(page);
    // ホテル名が表示されていることを確認
    const priceText = await page
      .locator('li.planThumb', {
        hasText: '30日前　早期予約プラン　室料のみ',
      }) // プラン名で絞り込み
      .locator('li.rm-type-wrapper', {
        hasText: 'ツインルームBタイプ《禁煙》',
      }) // 部屋タイプ名で絞り込み
      .locator('.discountedPrice > strong') // 対象の価格要素を指定
      .innerText();

    console.log('priceText', priceText);

    // 価格情報が存在することを確認
    await expect(priceText).toBeTruthy();
  });
});
