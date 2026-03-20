# 프론트엔드 연동 기준 API 추가 요구사항

기준 시점: 2026-03-20

검토 기준

- 프론트엔드 코드 전체(`src/app`, `src/components`, `src/lib/cluverse-api.ts`)에서 실제 호출 중인 API와 화면이 소비하는 필드를 기준으로 확인했습니다.
- 공개 API 문서는 `https://bebeis.github.io/cluverse-api/`를 기준으로 대조했습니다.
- 이미 연동 완료된 항목은 제외하고, 아직 미구현인 엔드포인트만 남겼습니다.

---

## 1. 일반 메시지/채팅 API

> **백엔드 미구현 — 작업 예정**

현재 상태

- [src/app/(main)/messages/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(main)/messages/page.tsx) 는 일반 DM/그룹 채팅 API가 없어 준비중 화면으로 막혀 있습니다.

추가 필요 API

- `GET /api/v1/chats`
- `POST /api/v1/chats`
- `GET /api/v1/chats/{chatId}/messages`
- `POST /api/v1/chats/{chatId}/messages`
- `PUT /api/v1/chats/{chatId}/read`

최소 요구 필드

- 채팅방: `chatId`, `chatType`, `title`, `participantCount`, `unreadCount`, `lastMessage`, `lastMessageAt`
- 상대/참여자: `memberId`, `nickname`, `profileImageUrl`
- 메시지: `messageId`, `senderId`, `content`, `messageType`, `createdAt`, `readBy`

---

## 2. 운영자/어드민 API

> **백엔드 미구현 — 작업 예정**

현재 상태

- `src/app/(admin)` 하위 페이지는 전부 정적 목업이며 대응 API가 없습니다.

### 2-1. 신고 관리

사용 화면

- [src/app/(admin)/admin/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(admin)/admin/page.tsx)
- [src/app/(admin)/admin/reports/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(admin)/admin/reports/page.tsx)

추가 필요 API

- `GET /api/v1/admin/reports`
- `GET /api/v1/admin/reports/{reportId}`
- `PATCH /api/v1/admin/reports/{reportId}/status`
- `POST /api/v1/admin/reports/{reportId}/actions`
- `GET /api/v1/admin/reports/{reportId}/audit-logs`

최소 요구 필드

- 신고 기본값: `reportId`, `status`, `reason`, `reporter`, `targetType`, `targetId`, `createdAt`
- 상세 맥락: 신고 대상 원문, 작성자 정보, 신고 사유 상세, 관련 타임라인
- 처리 이력: `actor`, `action`, `memo`, `createdAt`

### 2-2. 유저 관리

사용 화면

- [src/app/(admin)/admin/users/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(admin)/admin/users/page.tsx)

추가 필요 API

- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/{memberId}`
- `PATCH /api/v1/admin/users/{memberId}/status`
- `POST /api/v1/admin/users/{memberId}/sanctions`
- `GET /api/v1/admin/users/{memberId}/activity-logs`

최소 요구 필드

- `memberId`, `nickname`, `email`
- `universityName`, `majorName`
- `verificationStatus`, `status`
- `postCount`, `warningCount`
- `lastLoginAt`, `joinedAt`

### 2-3. 그룹 관리

사용 화면

- [src/app/(admin)/admin/groups/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(admin)/admin/groups/page.tsx)

추가 필요 API

- `GET /api/v1/admin/groups`
- `GET /api/v1/admin/groups/{groupId}`
- `PATCH /api/v1/admin/groups/{groupId}/status`
- `PATCH /api/v1/admin/groups/{groupId}/visibility`

최소 요구 필드

- `groupId`, `name`, `category`, `visibility`, `status`
- `ownerId`, `ownerNickname`
- `memberCount`, `postCount`, `openRecruitmentCount`
- `interests`

### 2-4. 학교/보드 관리

사용 화면

- [src/app/(admin)/admin/content/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(admin)/admin/content/page.tsx)

추가 필요 API

- `GET /api/v1/admin/boards/tree`
- `GET /api/v1/admin/boards/{boardId}`
- `PATCH /api/v1/admin/boards/{boardId}`
- `POST /api/v1/admin/boards`
- `DELETE /api/v1/admin/boards/{boardId}`
- `POST /api/v1/admin/boards/{boardId}/move`
- `POST /api/v1/admin/universities`
- `PATCH /api/v1/admin/universities/{universityId}`

최소 요구 필드

- 보드 트리: `boardId`, `name`, `type`, `parentBoardId`, `children`, `postCount`, `subscriberCount`
- 학교: `universityId`, `universityName`, `logoImageUrl`, `emailDomains`

### 2-5. 통계 대시보드

사용 화면

- [src/app/(admin)/admin/stats/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(admin)/admin/stats/page.tsx)

추가 필요 API

- `GET /api/v1/admin/stats/summary`
- `GET /api/v1/admin/stats/activity`
- `GET /api/v1/admin/stats/boards/ranking`
- `GET /api/v1/admin/stats/content-distribution`

최소 요구 필드

- `dau`, `wau`, `mau`
- `dailyPostCount`
- `reportCount`, `reportProcessedCount`
- 기간별 시계열 데이터
- 보드 랭킹 데이터
- 콘텐츠 유형 분포 데이터

---

## 3. 온보딩 화면의 ID 직접 입력 개선

> **프론트엔드 개선 사항 — 백엔드 작업 없음**

현재 상태

- [src/app/onboarding/major/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/major/page.tsx): 전공명을 고르는 UX 대신 ID 직접 입력 사용
- [src/app/onboarding/interest/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/interest/page.tsx): 관심사명을 고르는 UX 대신 ID 직접 입력 사용
- [src/app/(editor)/post/create/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(editor)/post/create/page.tsx): Presigned URL API가 문서화되어 있지만 이미지 업로드 플로우 미연동

비고

- `GET /api/v1/majors`, `GET /api/v1/interests`, Presigned URL 발급 API는 이미 문서에 존재합니다.
- 프론트 온보딩 화면에서 해당 API를 활용한 검색/선택 UX로 교체 필요. (settings/major-tags는 2026-03-20 기준 검색 기반으로 이미 교체 완료)

---

## 4. 회원 관련 API

> **백엔드 구현 완료 (2026-03-20) — 프론트 연동 완료 (2026-03-20)**

아래 항목은 백엔드 구현이 완료되었으며 프론트엔드 연동도 완료된 엔드포인트입니다.

| 엔드포인트 | 설명 | 연동 상태 |
|---|---|---|
| `PUT /api/v1/members/me/university` | 내 학교 정보 등록/변경 | ✅ 2026-03-20 settings/major-tags 연동 완료 |
| `GET /api/v1/members/{memberId}/followers` | 팔로워 목록 | ✅ 2026-03-20 settings/profile 연동 완료 |
| `GET /api/v1/members/{memberId}/following` | 팔로잉 목록 | ✅ 2026-03-20 settings/profile 연동 완료 |
| `GET /api/v1/members/me/posts` | 내가 작성한 게시글 목록 | ✅ 2026-03-20 settings/profile 연동 완료 |
| `PATCH /api/v1/members/me/password` | 비밀번호 변경 | ✅ 2026-03-20 settings/privacy 연동 완료 |
| `DELETE /api/v1/members/me` | 회원 탈퇴 | ✅ 2026-03-20 settings/privacy 연동 완료 |
| `POST /api/v1/members/me/profile-image/presigned-url` | 프로필 이미지 업로드용 presigned URL | ✅ 2026-03-20 settings/profile 연동 완료 |

미구현 (백엔드 작업 필요)

| 엔드포인트 | 설명 |
|---|---|
| 대학 이메일 인증 관련 | 재학생 인증 플로우 전체 없음 (`verificationStatus` 필드는 있음) |

---

## 5. 문서화 누락 현황 (2026-03-20 기준)

> 공개 GitHub Pages(`bebeis.github.io/cluverse-api/`) 기준으로 반영 여부를 재확인했습니다.

### 공개 문서 반영 완료

| 엔드포인트 | 비고 |
|---|---|
| `GET /api/v1/feeds/home` | ✅ 공개 문서 반영 완료 |
| `GET /api/v1/feeds/following` | ✅ 공개 문서 반영 완료 |
| `GET /api/v1/feeds/trending` | ✅ 공개 문서 반영 완료 (경로 `/posts/trending` → `/feeds/trending` 변경) |
| `GET /api/v1/bookmarks` | ✅ 공개 문서 반영 완료 (경로 `/posts/bookmarks` → `/bookmarks` 변경) |
| `GET /api/v1/posts/search` | ✅ 공개 문서 반영 완료 |
| `GET /api/v1/posts/{postId}/comments` | ✅ 공개 문서 반영 완료 (경로 `/comments?postId=` → `/posts/{postId}/comments` 변경) |
| `PUT /api/v1/comments/{commentId}` | ✅ 공개 문서 반영 완료 |

### 공개 문서 추가 반영 완료 (2026-03-20 이후)

| 엔드포인트 | 상태 |
|---|---|
| `GET/PUT /api/v1/notification-preferences` | ✅ 공개 문서 반영 완료 |
| `GET/PATCH/POST /api/v1/notifications` | ✅ 공개 문서 반영 완료 |
| `GET /api/v1/report-reasons`, `POST /api/v1/reports` | ✅ 공개 문서 반영 완료 |

### API 경로 변경 사항 (프론트 코드 반영 완료)

| 변경 전 | 변경 후 |
|---|---|
| `GET /api/v1/recruitment-applications?recruitmentId={id}` | `GET /api/v1/recruitments/{id}/applications` |
| `POST /api/v1/recruitment-applications?recruitmentId={id}` | `POST /api/v1/recruitments/{id}/apply` |
| `GET /api/v1/recruitment-applications/{applicationId}` | `GET /api/v1/applications/{applicationId}` |
| `PATCH /api/v1/recruitment-applications/{applicationId}/status` | `PATCH /api/v1/applications/{applicationId}/status` |
| `DELETE /api/v1/recruitment-applications/{applicationId}` | `DELETE /api/v1/applications/{applicationId}` |
| `GET/POST /api/v1/recruitment-applications/{applicationId}/messages` | `GET/POST /api/v1/applications/{applicationId}/messages` |

---

## 6. 게시글 / 댓글 관련 API

> **백엔드 구현 완료 (2026-03-20) — 프론트 연동 완료**

| 엔드포인트 | 설명 | 연동 상태 |
|---|---|---|
| `GET /api/v1/posts/search` | 키워드 게시글 검색 | ✅ 2026-03-20 explore 페이지 연동 완료 |
| `PUT /api/v1/comments/{commentId}` | 댓글 수정 | ✅ 2026-03-20 PostModal 연동 완료 |

---

## 7. 공고 관련 — 백엔드 구현 완료, 프론트 연동 완료

> **프론트엔드 작업 — 백엔드 작업 없음**

| 엔드포인트 | 설명 | 연동 상태 |
|---|---|---|
| `PUT /api/v1/recruitments/{id}` | 공고 수정 | ✅ 2026-03-20 연동 완료 |
| `DELETE /api/v1/recruitments/{id}` | 공고 삭제 | ✅ 2026-03-20 연동 완료 |
| `PATCH /api/v1/recruitments/{id}/status` | 공고 마감 / 재개 | ✅ 2026-03-20 연동 완료 |
| `GET /api/v1/applications/{applicationId}/messages` | 지원자↔운영자 채팅 조회 | ✅ 2026-03-20 연동 완료 |
| `POST /api/v1/applications/{applicationId}/messages` | 지원자↔운영자 채팅 전송 | ✅ 2026-03-20 연동 완료 |
