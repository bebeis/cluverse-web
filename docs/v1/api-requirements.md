# 프론트엔드 연동 기준 API 추가 요구사항

기준 시점: 2026-03-19

검토 기준

- 프론트엔드 코드 전체(`src/app`, `src/components`, `src/lib/cluverse-api.ts`)에서 실제 호출 중인 API와 화면이 소비하는 필드를 기준으로 확인했습니다.
- 공개 API 문서는 `https://bebeis.github.io/cluverse-api/`를 기준으로 대조했습니다.
- 이미 문서에 존재하는 API는 이 문서에서 제외하고, 현재도 부족한 엔드포인트 또는 필드만 남겼습니다.

## 1. 프로필/전공/관심사 응답 필드 보강

현재 문서에는 프로필 조회, 내 전공 목록, 관심사 목록 API가 존재합니다. 다만 화면에서 사람이 읽을 수 있는 표시값이 부족해서 일부 화면이 여전히 `ID` 기반으로 동작합니다.

### 1-1. `GET /api/v1/members/me/majors`

현재 프론트 요구사항

- `memberMajorId`
- `majorId`
- `majorType`
- `majorName`
- `collegeName` 또는 상위 카테고리명

실제 사용 화면

- [src/app/onboarding/major/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/major/page.tsx)
- [src/app/(settings)/settings/profile/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(settings)/settings/profile/page.tsx)
- [src/app/(settings)/settings/major-tags/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(settings)/settings/major-tags/page.tsx)

요구사항

- 응답에 `majorName`을 포함해 주세요.
- 가능하면 `collegeName` 또는 상위 전공/단과대 표시용 필드도 포함해 주세요.
- 최소한 프론트가 `majorId`만으로 다시 별도 lookup 하지 않아도 되도록 표시용 이름을 내려줘야 합니다.

예시

```json
{
  "memberMajorId": 12,
  "majorId": 301,
  "majorType": "PRIMARY",
  "majorName": "컴퓨터공학과",
  "collegeName": "공과대학"
}
```

### 1-2. `GET /api/v1/members/me/interests`

현재 프론트 요구사항

- `interestId`
- `interestName`
- `category`

실제 사용 화면

- [src/app/onboarding/interest/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/interest/page.tsx)
- [src/app/(settings)/settings/profile/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(settings)/settings/profile/page.tsx)
- [src/app/(settings)/settings/major-tags/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(settings)/settings/major-tags/page.tsx)

요구사항

- 응답에 `interestName`과 `category`를 포함해 주세요.
- 현재 문서 기준으로는 내 관심사 목록에서 표시용 이름이 없어 프론트가 `#interestId`만 출력합니다.

예시

```json
{
  "interestId": 14,
  "interestName": "해커톤",
  "category": "TECH"
}
```

### 1-3. `GET /api/v1/members/me/profile`

실제 사용 화면

- [src/components/layout/LeftAside.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/components/layout/LeftAside.tsx)
- [src/app/(settings)/settings/profile/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(settings)/settings/profile/page.tsx)

요구사항

- `postCount`: 사이드바와 마이페이지에서 활동 수치를 표시하기 위해 필요합니다.
- `entranceYear` 또는 `studentCode`: 학교 커뮤니티 특성상 학번/입학년도 표기가 필요합니다.

비고

- 현재 코드에서 사이드바 게시글 수가 `visibleFields.length`로 대체되어 있는데, 이는 실제 게시글 수가 아닙니다.

## 2. 북마크 전용 목록 API

현재 상태

- 문서에는 북마크 생성/취소(`POST/DELETE /api/v1/posts/{postId}/bookmarks`)만 있습니다.
- 북마크 목록 조회 API가 없어 [src/app/(main)/bookmarks/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(main)/bookmarks/page.tsx) 에서 홈 피드를 50개 가져온 뒤 `bookmarked === true` 인 항목만 임시 필터링하고 있습니다.

추가 필요 API

- `GET /api/v1/posts/bookmarks` 또는 `GET /api/v1/members/me/bookmarks`

최소 요구 쿼리

- `cursor` 또는 `page`
- `size`
- 정렬 옵션

최소 요구 응답

- 게시글 목록
- 다음 페이지 정보
- 각 게시글의 `bookmarked: true`

## 3. 캘린더 API

현재 상태

- [src/app/(main)/calendar/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(main)/calendar/page.tsx) 는 `GET /api/v1/calendar/events`를 직접 호출하지만, 공개 문서에는 캘린더 섹션이 없습니다.
- 현재는 실패 시 목업 데이터로 대체됩니다.

추가 필요 API

- `GET /api/v1/calendar/events`
- `POST /api/v1/calendar/events`
- `PUT /api/v1/calendar/events/{eventId}`
- `DELETE /api/v1/calendar/events/{eventId}`
- `GET /api/v1/calendar/events/upcoming`

최소 요구 필드

- `eventId`
- `title`
- `description`
- `category` (`PERSONAL`, `GROUP`, `SCHOOL`)
- `startAt`
- `endAt`
- `location`
- `allDay`
- `visibility`

비고

- 월간 그리드 렌더링까지 고려하면 `date` 문자열 하나보다 `startAt`/`endAt` 구조가 필요합니다.

## 4. 캠퍼스 이벤트 API

현재 상태

- [src/app/(main)/event/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(main)/event/page.tsx) 는 전부 정적 목업입니다.
- 캘린더와는 별도로, 학교 공식 행사/공지를 카드 리스트로 보여주는 화면입니다.

추가 필요 API

- `GET /api/v1/events`
- 선택적으로 `GET /api/v1/events/{eventId}`

최소 요구 필드

- `eventId`
- `title`
- `host`
- `startDate`
- `endDate`
- `location`
- `thumbnailImageUrl`
- `isOngoing`
- `summary`

## 5. 일반 메시지/채팅 API

현재 상태

- 문서에는 모집 지원 채팅 API만 있습니다.
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

## 6. 알림 API

현재 상태

- [src/app/(notifications)/notifications/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(notifications)/notifications/page.tsx) 는 전체가 정적 데이터입니다.
- 공개 문서에 알림 API가 없습니다.

추가 필요 API

- `GET /api/v1/notifications`
- `POST /api/v1/notifications/read-all`
- `PATCH /api/v1/notifications/{notificationId}/read`
- `GET /api/v1/notification-preferences`
- `PUT /api/v1/notification-preferences`

최소 요구 필드

- `notificationId`
- `type` (`COMMENT`, `REPLY`, `GROUP_APPROVED`, `GROUP_REJECTED`, `GROUP_ANNOUNCEMENT`, `FOLLOW`, `FOLLOWING_POST`)
- `title`
- `content`
- `excerpt`
- `isRead`
- `createdAt`
- `targetUrl`

알림 설정 필드

- `comments`
- `groups`
- `announcements`
- `follows`
- `marketing`

## 7. 신고 API

현재 상태

- 사용자 신고 모달 [src/components/report/ReportModal.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/components/report/ReportModal.tsx) 은 아직 서버 연동이 없습니다.
- 공개 문서에 신고 API가 없습니다.

추가 필요 API

- `POST /api/v1/reports`
- 선택적으로 `GET /api/v1/report-reasons`

최소 요청 필드

- `targetType` (`POST`, `COMMENT`, `MEMBER`, `CHAT_MESSAGE`, `GROUP`)
- `targetId`
- `reasonCode`
- `detail`
- `evidenceImageUrls`

비고

- 현재 UI는 이미지 최대 3장 첨부를 가정하고 있습니다.

## 8. 운영자/어드민 API

현재 상태

- `src/app/(admin)` 하위 페이지는 전부 정적 목업이며 공개 문서에 대응 API가 없습니다.
- 운영 환경에서 사용할 계획이라면 별도 Admin API 스펙이 필요합니다.

### 8-1. 신고 관리

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

### 8-2. 유저 관리

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
- `verificationStatus`
- `status`
- `postCount`
- `warningCount`
- `lastLoginAt`
- `joinedAt`

### 8-3. 그룹 관리

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
- `tags` 또는 `interests`

### 8-4. 학교/보드 관리

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

### 8-5. 통계 대시보드

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

## 9. 게시글 상세 응답의 `board` 필드 누락

현재 상태

- `GET /api/v1/posts/{postId}` 응답에서 일부 게시글의 `board` 필드가 `null` 또는 누락된 채로 내려옵니다.
- 프론트에서 `post.board.name`에 접근하면서 런타임 오류가 발생했습니다. (Vercel 배포 환경 `/post/970018`에서 재현)

요구사항

- `board` 필드는 항상 non-null로 내려와야 합니다.
- 최소 요구 필드: `boardId`, `boardType`, `name`, `parentBoardId`

예시

```json
{
  "board": {
    "boardId": 12,
    "boardType": "GENERAL",
    "name": "자유게시판",
    "parentBoardId": null
  }
}
```

비고

- 동일한 `FeedPost` 타입을 사용하는 피드 목록(`GET /api/v1/feeds/home` 등) 및 `mapPostCard` 함수도 영향을 받습니다.
- 백엔드에서 수정되기 전까지 프론트는 optional chaining으로 방어 처리했습니다.

## 10. 문서에는 있지만 프론트 문서가 오래된 항목

아래 항목은 공개 API 문서에 이미 존재하므로 "추가 필요 API"로 계속 남겨둘 필요는 없습니다.

- 전공 목록 조회 API
- 관심사 목록 조회 API
- 게시글 이미지 업로드용 Presigned URL 발급 API

다만 현재 프론트 구현은 아직 해당 API를 충분히 활용하지 못하고 있습니다.

- [src/app/onboarding/major/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/major/page.tsx): 전공명을 고르는 UX 대신 ID 직접 입력 사용
- [src/app/onboarding/interest/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/onboarding/interest/page.tsx): 관심사명을 고르는 UX 대신 ID 직접 입력 사용
- [src/app/(editor)/post/create/page.tsx](/Users/luna/Desktop_nonsync/project/cluverse-web/src/app/(editor)/post/create/page.tsx): Presigned URL API가 문서화되어 있지만 아직 이미지 업로드 플로우는 미연동
