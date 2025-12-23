'use client';

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useQueryState, parseAsString } from 'nuqs';
import {
  Hotel,
  Frown,
  RefreshCw,
  Send,
  SearchX,
} from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { ReservationCard } from './reservation-card';
import { SearchBar } from './search-bar';
import { StatusFilter } from './status-filter';
import { EmptyState } from './empty-state';
import { GmailSyncButton } from './gmail-sync-button';
import { Spinner } from '@/components/ui/spinner';
import type { Reservation } from '@/db/schema';

interface ReservationListProps {
  reservations: Reservation[];
  isGmailConnected?: boolean;
}

type FilterStatus =
  | 'all'
  | 'active'
  | 'cancelled'
  | 'rebooked';

// フィルタリングロジック
function filterReservations(
  reservations: Reservation[],
  filter: FilterStatus,
  searchQuery: string
): Reservation[] {
  // ステータスフィルタリング
  const statusFiltered = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  // 検索フィルタリング
  if (!searchQuery.trim()) return statusFiltered;

  const query = searchQuery.toLowerCase();
  return statusFiltered.filter((r) => {
    const hotelName = r.hotelName?.toLowerCase() || '';
    const planName = r.roomType?.toLowerCase() || '';
    return (
      hotelName.includes(query) || planName.includes(query)
    );
  });
}

// ソートロジック
function sortReservationsByCheckIn(
  reservations: Reservation[]
): Reservation[] {
  return [...reservations].sort(
    (a, b) =>
      new Date(a.checkInDate).getTime() -
      new Date(b.checkInDate).getTime()
  );
}

export function ReservationList({
  reservations,
  isGmailConnected = false,
}: ReservationListProps) {
  const [filter, setFilter] = useQueryState(
    'filter',
    parseAsString.withDefault('all')
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleConnectGmail = async () => {
    try {
      setIsConnecting(true);
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard?gmail=connected',
      });
    } catch (error) {
      console.error('Gmail connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncGmail = useCallback(async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(
        '/api/gmail/fetch-reservations',
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (data.success) {
        router.replace('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [router]);

  // Gmail接続完了後に自動的に同期処理を実行
  useEffect(() => {
    const gmailConnected = searchParams.get('gmail');
    const hasProcessed = sessionStorage.getItem(
      'gmail-sync-processed'
    );

    if (
      gmailConnected === 'connected' &&
      !isSyncing &&
      !hasProcessed
    ) {
      sessionStorage.setItem(
        'gmail-sync-processed',
        'true'
      );
      handleSyncGmail();
    }

    if (!gmailConnected && hasProcessed) {
      sessionStorage.removeItem('gmail-sync-processed');
    }
  }, [searchParams, handleSyncGmail, isSyncing]);

  // フィルタリングとソート
  const filterValue = (filter || 'all') as FilterStatus;
  const searchValue = searchQuery || '';
  const sortedReservations = useMemo(() => {
    const filtered = filterReservations(
      reservations,
      filterValue,
      searchValue
    );
    return sortReservationsByCheckIn(filtered);
  }, [reservations, filterValue, searchValue]);

  const hasNoReservations = reservations.length === 0;
  const hasFilteredResults =
    sortedReservations.length === 0 && !hasNoReservations;

  // アイコンコンポーネント
  const HotelIcon = () => (
    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[var(--accent-primary)]">
      <Hotel className="w-12 h-12 text-white" />
    </div>
  );

  const NotFoundIcon = () => (
    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[var(--bg-secondary)]">
      <Frown className="w-12 h-12 text-[var(--text-secondary)]" />
    </div>
  );

  const LoadingSpinnerIcon = () => (
    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[var(--accent-primary)]">
      <Spinner className="animate-spin w-12 h-12 text-white" />
    </div>
  );

  const SyncIcon = () => <RefreshCw className="w-5 h-5" />;

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  const ForwardIcon = () => <Send className="w-5 h-5" />;

  const PrivacyNotice = () => (
    <p className="text-xs text-[var(--text-tertiary)] text-center max-w-md mt-4 leading-relaxed">
      Tra-bellがGmailの同期により受け取る情報の使用方法については
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy?hl=ja#additional_requirements_for_specific_api_scopes"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[var(--text-secondary)] transition-colors"
      >
        Googleの制限付き利用条件
      </a>
      に準拠します。
    </p>
  );

  return (
    <div className="space-y-4">
      {/* Filters - Only show if there are reservations */}
      {reservations.length > 0 && (
        <div className="space-y-4">
          <SearchBar
            value={searchQuery || ''}
            onChange={setSearchQuery}
          />
          <StatusFilter
            value={filterValue}
            onChange={setFilter}
          />
        </div>
      )}

      {/* Reservation Cards */}
      {isSyncing ? (
        <EmptyState
          title="メールを同期中..."
          description={
            <>
              受信トレイから予約メールを取得し、解析しています。
              <br />
              しばらくお待ちください。
            </>
          }
          icon={<LoadingSpinnerIcon />}
        />
      ) : hasNoReservations ? (
        <EmptyState
          title="宿泊プランを登録しよう"
          description="受信トレイと接続すると予約内容が自動で登録されるので、登録する手間が省けます。"
          icon={<HotelIcon />}
          actions={
            <>
              {isGmailConnected ? (
                <>
                  <GmailSyncButton
                    onClick={handleSyncGmail}
                    disabled={isSyncing}
                    isLoading={isSyncing}
                    label="受信トレイと接続"
                    loadingLabel="同期中..."
                    icon={<SyncIcon />}
                  />
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold hover:border-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ForwardIcon />
                    メールから転送する
                  </button>
                </>
              ) : (
                <>
                  <GmailSyncButton
                    onClick={handleConnectGmail}
                    disabled={isConnecting}
                    isLoading={isConnecting}
                    label="受信トレイと接続"
                    loadingLabel="接続中..."
                    icon={<GoogleIcon />}
                  />
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 bg-white text-[var(--text-secondary)] hover:cursor-pointer font-semibold hover:border-[var(--bg-tertiary)] hover:opacity-80 transition-colors disabled"
                  >
                    <ForwardIcon />
                    メールから転送する
                  </button>
                </>
              )}
            </>
          }
          footer={<PrivacyNotice />}
        />
      ) : hasFilteredResults ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] mb-4">
            <SearchX className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <p className="text-[var(--text-secondary)]">
            該当する予約がありません
          </p>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">
            フィルター条件を変更してください
          </p>
        </div>
      ) : reservations.length === 0 && !isSyncing ? (
        <EmptyState
          title="見つかりませんでした"
          description={
            <>
              予約メールが見つかりませんでした。
              <br />
              受信トレイに予約確認メールがあるか確認してください。
            </>
          }
          icon={<NotFoundIcon />}
        />
      ) : (
        <div className="bg-white rounded-lg border border-[var(--bg-tertiary)] overflow-hidden">
          {sortedReservations.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );
}
