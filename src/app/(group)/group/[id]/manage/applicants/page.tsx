'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Download, FileText, Filter, MessageSquare, Send, X } from 'lucide-react';
import { AuthRequiredOverlay } from '@/components/ui/AuthRequiredOverlay';
import {
  ApiError, ApplicationMessage, RecruitmentApplication, RecruitmentSummary,
  cluverseApi, formatRelativeTime,
} from '@/lib/cluverse-api';
import styles from './Applicants.module.css';

const statusOptions = ['ALL', 'IN_REVIEW', 'APPROVED', 'REJECTED'] as const;

export default function ApplicantManagementPage() {
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const [recruitments, setRecruitments] = useState<RecruitmentSummary[]>([]);
  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState<number | null>(null);
  const [activeStatus, setActiveStatus] = useState<(typeof statusOptions)[number]>('ALL');
  const [applications, setApplications] = useState<RecruitmentApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<RecruitmentApplication | null>(null);
  const [note, setNote] = useState('');
  const [authRequired, setAuthRequired] = useState(false);

  // 채팅
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ApplicationMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cluverseApi.getRecruitments({ groupId, page: 1, size: 20 })
      .then(result => {
        setRecruitments(result.recruitments);
        setSelectedRecruitmentId(result.recruitments[0]?.recruitmentId ?? null);
      })
      .catch(caught => {
        if (caught instanceof ApiError && caught.statusCode === 401) {
          setAuthRequired(true);
        }
      });
  }, [groupId]);

  const loadApplications = async () => {
    if (!selectedRecruitmentId) return;
    const result = await cluverseApi.getRecruitmentApplications(selectedRecruitmentId, {
      status: activeStatus,
      page: 1,
      size: 20,
    });
    setApplications(result.applications);
    setSelectedApplication(result.applications[0] ?? null);
    setNote(result.applications[0]?.latestReviewNote ?? '');
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!selectedRecruitmentId) return;
        const result = await cluverseApi.getRecruitmentApplications(selectedRecruitmentId, {
          status: activeStatus,
          page: 1,
          size: 20,
        });
        if (cancelled) return;
        setApplications(result.applications);
        setSelectedApplication(result.applications[0] ?? null);
        setNote(result.applications[0]?.latestReviewNote ?? '');
      } catch {
        if (!cancelled) {
          setApplications([]);
          setSelectedApplication(null);
          setNote('');
        }
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [selectedRecruitmentId, activeStatus]);

  // 채팅 로드
  useEffect(() => {
    if (!chatOpen || !selectedApplication) return;
    cluverseApi.getApplicationMessages(selectedApplication.applicationId)
      .then(msgs => {
        setMessages(msgs);
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      })
      .catch(() => setMessages([]));
  }, [chatOpen, selectedApplication]);

  const openChat = (application: RecruitmentApplication) => {
    setSelectedApplication(application);
    setNote(application.latestReviewNote ?? '');
    setChatOpen(true);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !selectedApplication || sendingMsg) return;
    setSendingMsg(true);
    try {
      const msg = await cluverseApi.sendApplicationMessage(selectedApplication.applicationId, chatInput.trim());
      setMessages(prev => [...prev, msg]);
      setChatInput('');
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleStatusUpdate = async (status: 'APPROVED' | 'REJECTED' | 'IN_REVIEW') => {
    if (!selectedRecruitmentId || !selectedApplication) return;
    const updated = await cluverseApi.updateRecruitmentApplicationStatus(selectedApplication.applicationId, {
      status,
      note,
    });
    setSelectedApplication(updated);
    await loadApplications();
  };

  return (
    <AuthRequiredOverlay active={authRequired}>
      <div className={styles.page}>
        {/* ── 좌측: 지원자 목록 ── */}
        <section className={styles.listPanel}>
          <div className={styles.listHeader}>
            <div className={styles.listHeaderTop}>
              <div>
                <h2 className={styles.listTitle}>지원자 목록</h2>
              </div>
              <div className={styles.listActions}>
                <select
                  className={styles.filterBtn}
                  value={selectedRecruitmentId ?? ''}
                  onChange={e => setSelectedRecruitmentId(Number(e.target.value))}
                >
                  <option value="">모집글 선택</option>
                  {recruitments.map(item => (
                    <option key={item.recruitmentId} value={item.recruitmentId}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <button className={styles.exportBtn} type="button">
                  <Download size={16} /> 다운로드 준비 중
                </button>
              </div>
            </div>
            <div className={styles.statusTabs}>
              {statusOptions.map(status => (
                <button
                  key={status}
                  className={activeStatus === status ? styles.statusTabActive : styles.statusTabInactive}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.applicantList}>
            {applications.map(application => (
              <button
                key={application.applicationId}
                className={selectedApplication?.applicationId === application.applicationId ? styles.applicantCardActive : styles.applicantCard}
                onClick={() => {
                  setSelectedApplication(application);
                  setNote(application.latestReviewNote ?? '');
                  setChatOpen(false);
                }}
                type="button"
              >
                <div className={styles.applicantCardInner}>
                  <div className={styles.applicantLeft}>
                    <div className={styles.applicantAvatar}>
                      {application.applicantProfileImageUrl ? (
                        <img src={application.applicantProfileImageUrl} alt={application.applicantNickname} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                      ) : null}
                    </div>
                    <div>
                      <div className={styles.applicantName}>
                        <span className={styles.applicantNameText}>{application.applicantNickname}</span>
                        <span className={styles.applicantTag}>{application.position}</span>
                      </div>
                      <div className={styles.applicantSchool}>{application.recruitmentTitle}</div>
                    </div>
                  </div>
                  <div className={styles.applicantRight}>
                    <span className={styles.applicantStatus}>{application.status}</span>
                    <div className={styles.applicantTime}>{formatRelativeTime(application.createdAt)}</div>
                  </div>
                </div>
              </button>
            ))}
            {!applications.length ? <div className={styles.applicantCard}>지원자가 없습니다.</div> : null}
          </div>
        </section>

        {/* ── 우측: 상세 / 채팅 ── */}
        <aside className={styles.detailPanel}>
          {selectedApplication ? (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.detailHeaderLeft}>
                  <span className={styles.detailLabel}>상세 검토</span>
                </div>
                <button
                  className={chatOpen ? styles.chatBtnActive : styles.chatBtnInactive}
                  type="button"
                  onClick={() => setChatOpen(v => !v)}
                >
                  <MessageSquare size={16} />
                  {chatOpen ? '지원서 보기' : '채팅'}
                </button>
              </div>

              {chatOpen ? (
                /* ── 채팅 패널 ── */
                <div className={styles.chatPanel}>
                  <div className={styles.chatMessages}>
                    {messages.length === 0 && (
                      <p className={styles.chatEmpty}>아직 메시지가 없습니다.</p>
                    )}
                    {messages.map(msg => (
                      <div key={msg.messageId} className={styles.chatMsg}>
                        <div className={styles.chatMsgHeader}>
                          <span className={styles.chatMsgSender}>{msg.senderNickname}</span>
                          <span className={styles.chatMsgTime}>{formatRelativeTime(msg.createdAt)}</span>
                        </div>
                        <p className={styles.chatMsgContent}>{msg.content}</p>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                  <div className={styles.chatInputRow}>
                    <input
                      className={styles.chatInput}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="메시지 입력..."
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    />
                    <button className={styles.chatSendBtn} onClick={sendMessage} disabled={sendingMsg || !chatInput.trim()}>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── 지원서 상세 ── */
                <div className={styles.detailBody}>
                  <div className={styles.detailProfile}>
                    <div className={styles.detailProfileTop}>
                      <div className={styles.detailAvatar}>
                        {selectedApplication.applicantProfileImageUrl ? (
                          <img src={selectedApplication.applicantProfileImageUrl} alt={selectedApplication.applicantNickname} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : null}
                      </div>
                      <div className={styles.detailProfileInfo}>
                        <div className={styles.detailProfileNameRow}>
                          <span className={styles.detailProfileName}>{selectedApplication.applicantNickname}</span>
                          <span className={styles.detailProfileStatus}>{selectedApplication.status}</span>
                        </div>
                        <div className={styles.detailProfileTags}>
                          <span className={styles.detailProfileTag}>{selectedApplication.position}</span>
                          <span className={styles.detailProfileTag}>{selectedApplication.recruitmentTitle}</span>
                        </div>
                        <div className={styles.detailProfileContact}>
                          <span className={styles.detailProfileContactItem}>
                            <Filter size={14} /> 검토자: {selectedApplication.reviewerNickname ?? '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.qaSection}>
                    {selectedApplication.answers.map(answer => (
                      <div key={answer.formItemId}>
                        <div className={styles.qaLabel}>
                          <FileText size={16} /> 질문
                        </div>
                        <div className={styles.qaCard}>
                          <h4 className={styles.qaQuestion}>{answer.question}</h4>
                          <p className={styles.qaAnswer}>{answer.answer}</p>
                        </div>
                      </div>
                    ))}

                    <div>
                      <div className={styles.qaLabel}>
                        <CheckCircle size={16} /> 검토 메모
                      </div>
                      <div className={styles.memoBox}>
                        <p className={styles.memoText}>메모는 상태 변경 시 함께 저장됩니다.</p>
                        <div className={styles.memoInputRow}>
                          <input
                            className={styles.memoInput}
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="검토 메모"
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button className={styles.memoSubmitBtn} type="button" onClick={() => handleStatusUpdate('IN_REVIEW')}>검토중</button>
                          <button className={styles.memoSubmitBtn} type="button" onClick={() => handleStatusUpdate('APPROVED')}>승인</button>
                          <button className={styles.memoSubmitBtn} type="button" onClick={() => handleStatusUpdate('REJECTED')}>거절</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.detailBody}>선택된 지원자가 없습니다.</div>
          )}
        </aside>
      </div>
    </AuthRequiredOverlay>
  );
}
