# 🚀 프론트엔드 연동을 위해 추가/수정이 필요한 API 목록

현재 `cluverse-api/build/docs/asciidoc/index.html` 기반으로 실제 클라이언트와 연동 작업을 진행 중이나, 다음의 API 또는 필드들이 누락되어 있어 모킹(Mocking) 처리했습니다. 백엔드 팀에서 해당 API 스펙과 데이터를 추가해 주시기 바랍니다.

## 1. LeftAside (주요 정보 사이드바) 화면
현재 프로필 조회(`GET /api/v1/members/me/profile`)와 학과 조회(`GET /api/v1/members/me/majors`) API가 존재하지만 다음 데이터가 부족합니다.

* **추가 필요 필드**
  * `postCount` (작성한 게시글 수): 프로필 조회 응답에 포함되거나 별도 API 필요.
  * `entranceYear` 또는 `studentId` (학번, 예: 21학번): 프로필 또는 학과 정보에 포함.
  * `majorName` (학과명): `api/v1/members/me/majors` 응답 시 `majorId` 뿐만 아니라 화면에 표시할 수 있는 `majorName` (예: "경영학과")이 필수적입니다.

## 2. 캘린더 (Calendar) 화면
개인 일정 및 학교, 동아리 관련 일정을 관리하는 달력 화면입니다. 현재 일정(Calendar/Event) 관련 API가 전무하여 전체 모킹 처리되었습니다.

* **추가 필요 API**
  * `GET /api/v1/calendar/events` (또는 `schedules`): 특정 월/주간 개인+동아리+학교 일정 목록 조회 (쿼리로 `year`, `month` 등 전달)
  * `POST /api/v1/calendar/events`: 새 일정 추가
  * `GET /api/v1/calendar/events/upcoming`: 다가오는 일정(Upcoming events) 2~3건 조회

## 3. 메시지 (Messages / DM) 화면
현재 "지원 채팅 메시지" 관련 API만 존재합니다. 프론트엔드에서는 우선 **"준비 중인 기능" (Under Construction)** 상태로 UI를 전환해 두었습니다. 향후 정식 개발 시 다음 API들이 필요할 것으로 예상되어 스펙에 남겨둡니다.

* **추가 필요 API**
  * `GET /api/v1/chats` (또는 `rooms`): 참여 중인 채팅방(1:1, 그룹) 목록 조회 (상대방 프로필, 마지막 메시지, 안 읽은 메시지 수 포함)
  * `GET /api/v1/chats/{chatId}/messages`: 특정 채팅방의 단체 및 1:1 대화 내역 조회 이력 (페이징)
  * `POST /api/v1/chats/{chatId}/messages`: 새로운 메시지 전송 기능
  * `PUT /api/v1/chats/{chatId}/read`: 채팅방 읽음 처리

## 4. 메인 피드 (Feed) 화면
최신 API 문서에 피드 전용 API(`GET /api/v1/feeds/home` 등)가 추가된 것을 확인하고 연동을 진행했습니다. 그러나 피드의 `PostCard` 렌더링에 필수적인 작성자 소속(학교) 정보가 응답 데이터에서 누락되어 해당 부분만 모킹 처리했습니다.

* **추가/수정 필요 필드**
  * `author.universityName` (또는 `author.schoolName`): 작성자의 소속 대학교 명칭. 피드 게시글의 작성자 프로필 옆에 소속을 표기하기 위해 필수적으로 필요한 데이터입니다. (현재 `author` 객체 내부에 `nickname`, `profileImageUrl`만 존재)
