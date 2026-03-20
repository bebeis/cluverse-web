# 프론트엔드 연동 기준 API 추가 요구사항

기준 시점: 2026-03-20

검토 기준

- 프론트엔드 코드 전체(`src/app`, `src/components`, `src/lib/cluverse-api.ts`)에서 실제 호출 중인 API와 화면이 소비하는 필드를 기준으로 확인했습니다.
- 공개 API 문서는 `https://bebeis.github.io/cluverse-api/`를 기준으로 대조했습니다.
- 이미 연동 완료된 항목은 제외하고, 아직 미구현인 엔드포인트만 남겼습니다.

---

## 1. 일반 메시지/채팅 API

현재 상태

- [src/app/(main)/messages/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(main)/messages/page.tsx) 는 일반 DM/그룹 채팅 API가 없어 준비중 화면으로 막혀 있습니다.
- 지원자 관리 화면 [src/app/(group)/group/[id]/manage/applicants/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(group)/group/[id]/manage/applicants/page.tsx) 도 "채팅 API 없음" 상태입니다.

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

현재 상태

- [src/app/onboarding/major/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/major/page.tsx): 전공명을 고르는 UX 대신 ID 직접 입력 사용
- [src/app/onboarding/interest/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/interest/page.tsx): 관심사명을 고르는 UX 대신 ID 직접 입력 사용
- [src/app/(editor)/post/create/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(editor)/post/create/page.tsx): Presigned URL API가 문서화되어 있지만 이미지 업로드 플로우 미연동

비고

- `GET /api/v1/majors`, `GET /api/v1/interests`, Presigned URL 발급 API는 이미 문서에 존재합니다.
- 프론트 온보딩 화면에서 해당 API를 활용한 검색/선택 UX로 교체가 필요합니다. (API 추가 요청이 아닌 프론트 개선 사항)
