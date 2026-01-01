import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

// R2クライアントの初期化
const getR2Client = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.warn(
      'R2 credentials are not fully configured. Screenshots will not be uploaded.'
    );
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

/**
 * スクリーンショットをR2にアップロード
 * @param reservationId 予約ID
 * @param jobName ジョブ名（例: 'scroll_complete'）
 * @param buffer 画像バッファ
 * @param contentType コンテンツタイプ（デフォルト: 'image/png'）
 * @returns 公開URL（設定されていない場合はnull）
 */
export async function uploadScreenshot(
  reservationId: string,
  jobName: string,
  buffer: Buffer,
  contentType = 'image/png'
): Promise<string | null> {
  const client = getR2Client();
  const bucketName =
    process.env.R2_BUCKET_NAME || 'snapshots';
  const publicUrlBase =
    process.env.R2_PUBLIC_URL ||
    'https://blob.tra-bell.com';

  if (!client || !bucketName) {
    return null;
  }

  const key = `${bucketName}/${reservationId}/${jobName}.png`;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = publicUrlBase
      ? `${publicUrlBase}/${key}`
      : null; // 公開URLが設定されていない場合はnullを返す

    console.log(`[R2] Screenshot uploaded: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(
      `[R2] Failed to upload screenshot: ${key}`,
      error
    );
    return null;
  }
}
