'use client';

import {
  formatPrice,
  formatDate,
  calculatePriceDrop,
  isBeforeDeadline,
} from '@/lib/utils';
import { formatGuestCount } from '@/lib/utils/reservation';
import type {
  Reservation,
  PriceHistory,
} from '@/db/schema';
import {
  Calendar,
  Users,
  Bed,
  CalendarClock,
  MapPin,
  Phone,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { PriceHistoryChart } from './price-history-chart';
import { Button } from '../ui/button';
import type { LucideIcon } from 'lucide-react';

interface ReservationDetailProps {
  reservation: Reservation;
  priceHistory: PriceHistory[];
}

interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

function DetailItem({
  icon: Icon,
  label,
  value,
  iconBgColor,
  iconColor,
}: DetailItemProps) {
  return (
    <div className="flex gap-4">
      <div
        className={`mt-1 p-2 ${iconBgColor} rounded-lg ${iconColor} shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
          {label}
        </p>
        <div className="text-xs text-[var(--text-primary)]">
          {value}
        </div>
      </div>
    </div>
  );
}

export function ReservationDetail({
  reservation,
  priceHistory,
}: ReservationDetailProps) {
  const priceDrop = calculatePriceDrop(
    reservation.originalPrice,
    reservation.currentPrice
  );
  const canCancel = isBeforeDeadline(
    reservation.cancellationDeadline
  );

  return (
    <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white overflow-hidden shadow-sm">
      {/* Hotel Thumbnail Image */}
      {reservation.roomThumbnailUrl && (
        <div className="w-full h-64 aspect-square relative bg-[var(--bg-secondary)]">
          <Image
            src={reservation.roomThumbnailUrl}
            alt={reservation.hotelName}
            fill
          />
        </div>
      )}

      <div className="py-4 px-6 border-b border-[var(--bg-tertiary)] bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
                {reservation.hotelName}
              </h1>
              {reservation.planName && (
                <p className="text-xs mt-1 text-[var(--text-primary)] leading-relaxed">
                  {reservation.planName}
                </p>
              )}
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                予約番号: {reservation.reservationId}
              </p>
              {reservation.cancellationDeadline && (
                <div className="mt-2">
                  {canCancel ? (
                    <p className="text-sm font-semibold text-emerald-600">
                      {new Date(
                        reservation.cancellationDeadline
                      ).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}{' '}
                      までキャンセル無料
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-rose-600">
                      キャンセル料発生
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="px-6 py-4 border-b border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]">
        <div className="grid grid-cols-3 gap-4 md:gap-4 lg:gap-8 items-end">
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              予約時の価格
            </p>
            <p className="text-xl font-semibold text-[var(--text-primary)]">
              {formatPrice(reservation.originalPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              現在の価格
            </p>
            <p className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              {formatPrice(reservation.currentPrice)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                節約額
              </p>
              {priceDrop.amount > 0 && (
                <span className="text-xs text-emerald-600">
                  {priceDrop.percentage}% OFF
                </span>
              )}
            </div>
            {priceDrop.amount > 0 ? (
              <p className="text-xl font-bold text-emerald-600">
                {formatPrice(priceDrop.amount)}
              </p>
            ) : (
              <p className="text-xl font-semibold text-[var(--text-tertiary)]">
                ¥0
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      <div className="border-[var(--bg-tertiary)]">
        <PriceHistoryChart
          priceHistory={priceHistory}
          originalPrice={reservation.originalPrice}
        />
      </div>

      {/* Rebook Button */}
      {(reservation.affiliateUrl ||
        reservation.hotelUrl) && (
        <div className="px-6 pb-4 border-b border-[var(--bg-tertiary)]">
          <Button
            asChild
            variant="default"
            size="lg"
            className="w-full rounded-full bg-[var(--accent-primary)] text-[var(--text-on-accent)] hover:bg-[var(--accent-primary)]/90"
          >
            <a
              href={
                reservation.affiliateUrl ||
                reservation.hotelUrl ||
                '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-6 h-6 shrink-0" />
              <span className="text-base font-semibold">
                予約を取り直して節約する
              </span>
            </a>
          </Button>
        </div>
      )}

      {/* Details Section */}
      <div className="p-6">
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-6">
          宿泊プラン詳細
        </h2>
        <div className="grid grid-cols-1 gap-x-12 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            {reservation.reservationDate && (
              <DetailItem
                icon={CalendarClock}
                label="予約日"
                value={formatDate(
                  reservation.reservationDate
                )}
                iconBgColor="bg-slate-50"
                iconColor="text-slate-500"
              />
            )}
            <DetailItem
              icon={Calendar}
              label="宿泊日程"
              value={
                <>
                  {formatDate(reservation.checkInDate)} 〜{' '}
                  {formatDate(reservation.checkOutDate)}
                </>
              }
              iconBgColor="bg-orange-50"
              iconColor="text-orange-500"
            />
            {reservation.roomType && (
              <DetailItem
                icon={Bed}
                label="部屋タイプ"
                value={
                  <span className="leading-normal">
                    {reservation.roomType}
                  </span>
                }
                iconBgColor="bg-purple-50"
                iconColor="text-purple-500"
              />
            )}
            {reservation.roomCount && (
              <DetailItem
                icon={Bed}
                label="部屋数"
                value={`${reservation.roomCount}室`}
                iconBgColor="bg-cyan-50"
                iconColor="text-cyan-500"
              />
            )}
            {(reservation.adultCount ||
              reservation.childCount) && (
              <DetailItem
                icon={Users}
                label="宿泊人数"
                value={formatGuestCount(
                  reservation.adultCount,
                  reservation.childCount
                )}
                iconBgColor="bg-indigo-50"
                iconColor="text-indigo-500"
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {(reservation.hotelPostalCode ||
              reservation.hotelAddress) && (
              <DetailItem
                icon={MapPin}
                label="ホテル住所"
                value={
                  <>
                    {reservation.hotelPostalCode && (
                      <p>〒{reservation.hotelPostalCode}</p>
                    )}
                    {reservation.hotelAddress && (
                      <p className="mt-1">
                        {reservation.hotelAddress}
                      </p>
                    )}
                  </>
                }
                iconBgColor="bg-green-50"
                iconColor="text-green-500"
              />
            )}
            {reservation.hotelTelNo && (
              <DetailItem
                icon={Phone}
                label="ホテル電話番号"
                value={reservation.hotelTelNo}
                iconBgColor="bg-teal-50"
                iconColor="text-teal-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
