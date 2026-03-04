'use client';

import React, { useState } from 'react';
import styles from './CommentTree.module.css';
import {
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  ChevronRight,
  Plus,
  ChevronsUpDown,
  Flag,
  PenLine,
} from 'lucide-react';

/* ── Mock Data ──────────────────────────── */
const avatars = {
  me: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa0o30baIQ3OLo48b8fZbDaC_2pLW4g9rDSNIb67_Ct5Y117Bs1C8QtvHgAqKxo2bZY6DpiTcYkytW-j2TlggrhMYcc5LS5KxgM2cWWo7Xf8BD1APGLa5S2OhArrmobpywJQnJno8Oj2zzOSyl3L-Dg2ta__WHvxnSwdMB6ewTpk1lZDbw60cAEm2GKEbKK6PuwHEFfPQlCdyKJ1yp4iWrxNHq3RURX_YV8usxtUg8ZwuQiwtYy8AZ2kVvkbT3NX6PZXuONX4bz_Qb',
  kim: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr6fYe5u1XgxsCfc5AS9zvP3_0WVeDMrAjPQIlgZrLYhnePwnT6uP_tXRPM8R6rBTYAg16uWqGkIIjXcnFQtXNxYusKdNNgHsJfyIOa_BGziedO1-ekoIIFyh1OeIf0HNoKIPvtUi3VuxmlqIDPIwisvRoOKhfMOBOk3AC_hLbNxfm0DZGb7tQIbJycaZFFjDowaaFF6Ile_2dYJ5ysBXbjD3-PN5d-iOkl7y6DU6CeVHXZDdal-t_KNkjI8A7j0lSMlhFVXnpFBlI',
  lee: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA587j564p3x7TWbAlVQ_QpWavH3xu0Ms9tpMvk6bcBF9lHflctTNIj9F3BOPOfY141an6KcwAf3KC7-qc8vaTUUew92edceQkqsRgjcGsOkTS6-l0tjQyWVTHPTUdgGb7oahPdILrAjVebZiJpyB43ScVSNDAeIA3lFShETEaKpYnGHSY1Gm5Xo4tAieewWmxU83Ye2GxadGZN0rCw42lYkFzpEqFKOyQSKcyAUg-rs8AK_jmVryXlem08sDNB3UVjc9c1wwgFlOZo',
  park: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWQlW56jCA6viwwsZZ_de1NpFT-03haUT5B8ug_Gmlmgd9tceYwBdpWeXEYGHsUcjMXe8wqzJHrWiRJvbE9sZMp2JInP8TdXtIrPLXtBXF0rsXGeBahU8DrFw6HEgs2_CjT1QnqpHKUOSqraEE0CRLdFLW-lSkdoc7R5HF5gW5Wvw38BDSxLJpk9sLPrCHz5nU9hZ320GiUPlek3BWCK2NI_ucleaUuUyDIPKQxNfZzoMZp_65gF-GYW_b_nvul3c3eSTG5o-HuPdW',
  choi: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq4j2y7UH6S7FU3pOyM0rhnei0hQoeVFD6bYaHHYXp7e-miCDEaSYeZxyzPlYdRFxBLk-dw6YNR44OKhQ_TEpQG0bmH2xkR_8I--SvlPcvqtKOKlxb55WuAi9i_qQsJKCKliMCNYTfIY87PlAls6_3LpG2KuK5s_d-WHtJU9jXQ6QDXeC5yX1NcaAg-lvglfWgAboYgUgbknhgqoGB3vGk4AC8kBrzI_7jfrVbOWmjQ-xCK78Pq3YtOzBnr6j40rHveEmuktKwVN6R',
  jung: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuHElN8HZy_FNC7q9KMciD6Fr3LWUWCdRY0nwG13X2RbcrBtaZBu0NhtOKVYzimCZJlALRKM1ZpOrVeO4svaY4HKs6VFCEfFiKkUOVl7a9QCOrOAdnIbwkj9OBMSzju23qBBXVU0gwistGByHuRoiDOxmORteipHzWAogM2hEffIk9e6evwjjur13SFD_wTLEFnwkUJ5-SkO_njrfcN76N4hlVjIrjzlV5uepX7r9XcNkM9yvtdKGcq-XcM8Q_thgZrUKu8PC0QPDx',
  extra1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr0SjpC0AFAaK9gxZhQwqe4PZccxR7Lye7uvlzWVA4MPx86ElJ8O8HpuiDYNUQWxpVbK-bzBYFWzZXJ6n_RQ2noDpTRDN5w_rO-U5g2s39k5Utyii_J4kkLkEgZ0jXaH05VfItcDba7n-ZnX6JBJwboJmaJ0uqjBjtloq2FzV4w_e1hWQt9o_uxpvnKmw2w44BXJ51_l6zBYoWvC8CeFYcv6K7DZeN_g9wc5sjZFPrCvgSTgZ5W5DOgZ6EOx103dLhSlEhKCsqSFvV',
  extra2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMTRASbWTR7XZlWSTmYcwzzwj0KFJ-xgrOvh_VglyTuVHHBBPa75TKvjl-DaKF6NRRYENHlRkSneW-EjmX5-BCjDBTmbXMbzb6xwIcbta5mOErAQEpriOFO86d8uZOP8ZVgpuDd6i8AEC69UPNmqyOsnN_TWGGnB713DdopmVPyPvSN1J0RJWvth9-pVRlEujwuGMZQ2QdhDCRcGZ_txKWyZDOAqIOcRHvS36xKSGCbdNusVX3IIik2ycLmyyPwy51p0VGZP6QUBaQ',
};

export default function CommentTreePage() {
  const [activeSort, setActiveSort] = useState('latest');

  return (
    <div className={styles.page}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbTag}>토론</span>
          <span className={styles.breadcrumbPath}>자유게시판 &gt; 기술 토론</span>
        </div>
        <h1 className={styles.postTitle}>무한 뎁스 댓글 트리 시스템 제안</h1>
        <p className={styles.postDesc}>
          복잡한 대화 흐름을 효율적으로 관리하는 계층형 댓글 시스템의 UX 예시입니다.
          대댓글의 깊이가 깊어질 때의 가독성 문제를 해결합니다.
        </p>
      </div>

      {/* Comments Card */}
      <div className={styles.commentsCard}>
        {/* Header */}
        <div className={styles.commentsHeader}>
          <div className={styles.commentCount}>
            댓글 <span>128</span>
          </div>
          <div className={styles.sortButtons}>
            {(['latest', 'oldest', 'top'] as const).map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <span className={styles.sortDivider}>|</span>}
                <button
                  className={activeSort === s ? styles.sortBtnActive : styles.sortBtnInactive}
                  onClick={() => setActiveSort(s)}
                >
                  {s === 'latest' ? '최신순' : s === 'oldest' ? '등록순' : '추천순'}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className={styles.commentInput}>
          <img className={styles.inputAvatar} src={avatars.me} alt="내 프로필" />
          <div className={styles.inputBody}>
            <textarea
              className={styles.inputTextarea}
              placeholder="이 주제에 대한 의견을 남겨주세요..."
            />
            <div className={styles.inputActions}>
              <button className={styles.submitBtn}>댓글 작성</button>
            </div>
          </div>
        </div>

        {/* Thread List */}
        <div className={styles.threadList}>
          {/* ── Thread 1 (with deep replies) ──── */}
          <div className={styles.commentThread}>
            <div className={styles.comment}>
              <div className={styles.avatarCol}>
                <img className={styles.commentAvatar} src={avatars.kim} alt="김철수" />
                <div className={styles.threadLine} title="스레드 접기" />
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <div className={styles.commentMetaLeft}>
                    <span className={styles.authorLabel}>김철수</span>
                    <span className={styles.opBadge}>작성자</span>
                    <span className={styles.timeLabel}>• 2시간 전</span>
                  </div>
                  <button className={styles.moreBtn}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <p className={styles.commentText}>
                  이 주제에 대해 정말 흥미로운 점이 많네요. 특히 3번째 문단의 내용이 인상깊습니다.
                  무한 뎁스를 구현할 때 가장 중요한 것은 성능 최적화라고 생각합니다. Virtual Scrolling을
                  적용하는 것은 어떨까요?
                </p>
                <div className={styles.commentActions}>
                  <button className={styles.actionItem}>
                    <ThumbsUp size={16} /> <span>45</span>
                  </button>
                  <button className={styles.actionItem}>
                    <MessageCircle size={16} /> <span>답글 15</span>
                  </button>
                  <button className={styles.reportBtn}>
                    <Flag size={13} /> 신고
                  </button>
                </div>
              </div>
            </div>

            {/* Reply depth 1 */}
            <div className={styles.replies}>
              <div className={styles.replyConnector} />
              <div className={styles.comment}>
                <div className={styles.avatarCol}>
                  <img className={`${styles.commentAvatar} ${styles.avatarSm}`} src={avatars.lee} alt="이영희" />
                  <div className={styles.threadLine} />
                </div>
                <div className={styles.commentBody}>
                  <div className={styles.commentMetaLeft}>
                    <span className={styles.authorLabel}>이영희</span>
                    <span className={styles.timeLabel}>• 1시간 전</span>
                  </div>
                  <p className={styles.commentText}>
                    저도 동감합니다! 혹시 관련 자료를 더 찾아보셨나요? React Window 같은 라이브러리를 쓰면 좋겠네요.
                  </p>
                  <div className={styles.commentActions}>
                    <button className={styles.actionItem}>
                      <ThumbsUp size={14} /> <span>12</span>
                    </button>
                    <button className={styles.actionItem}>
                      <MessageCircle size={14} /> <span>답글 3</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply depth 2 */}
              <div className={styles.deepReplies}>
                <div className={styles.deepReplyConnector} />
                <div className={styles.comment}>
                  <div className={styles.avatarCol}>
                    <img className={`${styles.commentAvatar} ${styles.avatarXs}`} src={avatars.park} alt="박준형" />
                    <div className={styles.threadLine} />
                  </div>
                  <div className={styles.commentBody}>
                    <div className={styles.commentMetaLeft}>
                      <span className={styles.authorLabel}>박준형</span>
                      <span className={styles.timeLabel}>• 45분 전</span>
                    </div>
                    <p className={styles.commentText}>
                      <span className={styles.mention}>@이영희</span>
                      네 맞습니다. 다만 구조가 복잡해지면 상태 관리가 까다로울 수 있어서 Recoil이나 Jotai 같은
                      아토믹 패턴도 고려해보세요.
                    </p>
                    <div className={styles.commentActions}>
                      <button className={styles.actionItem}>
                        <ThumbsUp size={14} /> <span>5</span>
                      </button>
                      <button className={styles.actionItem}>
                        <MessageCircle size={14} /> <span>답글 2</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <div className={styles.expandBox}>
                  <div className={styles.expandConnector} />
                  <button className={styles.expandBtn}>
                    <div className={styles.expandProgress}>
                      <div className={styles.expandProgressFill} style={{ width: '20%' }} />
                    </div>
                    <div className={styles.expandLeft}>
                      <div className={styles.expandIconCircle}>
                        <Plus size={18} />
                      </div>
                      <div className={styles.expandText}>
                        <span className={styles.expandTitle}>대댓글 12개 더보기</span>
                        <span className={styles.expandSub}>현재 3개 / 총 15개 답글</span>
                      </div>
                    </div>
                    <div className={styles.expandRight}>
                      <div className={styles.avatarStack}>
                        <img className={styles.stackAvatar} src={avatars.extra1} alt="" />
                        <img className={styles.stackAvatar} src={avatars.extra2} alt="" />
                        <div className={styles.stackCount}>+10</div>
                      </div>
                      <ChevronRight size={18} className={styles.expandChevron} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Thread 2 (collapsed) ──────────── */}
          <div className={styles.commentThread}>
            <div className={styles.collapsedComment}>
              <div className={styles.avatarCol}>
                <img className={styles.commentAvatar} src={avatars.choi} alt="최민수" />
                <div className={styles.threadLine} />
              </div>
              <div className={styles.collapsedBody}>
                <div className={styles.collapsedHeader}>
                  <div className={styles.collapsedMeta}>
                    <span className={styles.authorLabel}>최민수</span>
                    <span className={styles.timeLabel}>• 3시간 전</span>
                  </div>
                  <button className={styles.unfoldBtn}>
                    <ChevronsUpDown size={18} />
                  </button>
                </div>
                <div className={styles.collapsedPreview}>
                  <span className={styles.collapsedText}>댓글이 접혀있습니다.</span>
                  <span className={styles.replyCountBadge}>답글 8개</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Thread 3 (normal, no replies) ─── */}
          <div className={styles.commentThread}>
            <div className={styles.comment}>
              <div className={styles.avatarCol}>
                <img className={styles.commentAvatar} src={avatars.jung} alt="정다은" />
              </div>
              <div className={styles.commentBody}>
                <div className={styles.commentMeta}>
                  <div className={styles.commentMetaLeft}>
                    <span className={styles.authorLabel}>정다은</span>
                    <span className={styles.timeLabel}>• 5시간 전</span>
                  </div>
                  <button className={styles.moreBtn}>
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <p className={styles.commentText}>
                  좋은 정보 감사합니다! 스크랩 해두고 나중에 다시 읽어봐야겠어요.
                </p>
                <div className={styles.commentActions}>
                  <button className={styles.actionItem}>
                    <ThumbsUp size={16} /> <span>82</span>
                  </button>
                  <button className={styles.actionItem}>
                    <MessageCircle size={16} /> <span>답글 0</span>
                  </button>
                  <button className={styles.reportBtn}>
                    <Flag size={13} /> 신고
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <div className={styles.mobileFab}>
        <button className={styles.fabBtn}>
          <PenLine size={18} />
          댓글 쓰기
        </button>
      </div>
    </div>
  );
}
