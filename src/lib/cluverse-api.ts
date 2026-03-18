import { fetchApi } from '@/lib/fetchApi';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export type ApiEnvelope<T> = {
  status: string;
  message: string;
  data: T;
  code: number;
};

export type University = {
  universityId: number;
  universityName: string;
  universityBadgeImageUrl?: string | null;
};

export type Term = {
  termsId: number;
  termsType: string;
  title: string;
  content: string;
  version: string;
  required: boolean;
  effectiveAt: string;
};

export type Profile = {
  memberId: number;
  nickname: string;
  university: University | null;
  verificationStatus?: string;
  bio: string | null;
  profileImageUrl: string | null;
  linkGithub: string | null;
  linkNotion: string | null;
  linkPortfolio: string | null;
  linkInstagram: string | null;
  linkEtc: string | null;
  isPublic: boolean;
  visibleFields: string[];
  isFollowing: boolean;
  isBlocked: boolean;
  followerCount: number;
  followingCount: number;
};

export type AuthMember = {
  memberId: number;
  nickname: string;
  role: string;
};

export type BoardRef = {
  boardId: number;
  boardType: string;
  name: string;
  parentBoardId: number | null;
};

export type FeedPost = {
  postId: number;
  board: BoardRef;
  category: string;
  title: string;
  contentPreview?: string;
  content?: string;
  tags: string[];
  thumbnailImageUrl?: string | null;
  imageUrls?: string[];
  isAnonymous: boolean;
  isPinned: boolean;
  isExternalVisible: boolean;
  isMine?: boolean;
  liked?: boolean;
  bookmarked?: boolean;
  hiddenByBlock?: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  author: {
    memberId: number;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  updatedAt?: string;
};

export type CursorPage<T> = {
  posts: T[];
  nextCursor: string | null;
  limit: number;
  hasNext: boolean;
};

export type GroupSummary = {
  groupId: number;
  name: string;
  description: string;
  coverImageUrl: string | null;
  category: string;
  activityType: string;
  region: string;
  visibility: string;
  status: string;
  maxMembers: number;
  memberCount: number;
  recruiting: boolean;
  openRecruitmentCount: number;
  interests: Array<{ interestId: number; name: string }>;
  myRole?: string;
  member?: boolean;
  boardId?: number;
};

export type GroupDetail = GroupSummary & {
  boardId: number;
  ownerId: number;
  ownerNickname: string;
  roles: Array<{ groupRoleId: number; title: string; displayOrder: number }>;
  createdAt: string;
  updatedAt: string;
};

export type BoardDetail = {
  boardId: number;
  boardType: string;
  name: string;
  description: string;
  isReadable: boolean;
  isWritable: boolean;
  isManageable: boolean;
  isMemberOnly: boolean;
  defaultTab?: string;
  tabs?: Array<{
    tab: string;
    label: string;
    category: string;
    isDefault: boolean;
    isVisible: boolean;
    isWriteAllowed: boolean;
  }>;
  supportedSorts?: string[];
  postingPolicy?: {
    isAnonymousAllowed: boolean;
    isExternalVisibleAllowed: boolean;
    isPinnedAllowed: boolean;
    supportedCategories: string[];
  };
  group?: {
    groupId: number;
    groupName: string;
    visibility: string;
    isMember: boolean;
    myRole: string;
  };
};

export type MemberMajor = {
  memberMajorId: number;
  majorId: number;
  majorType: string;
};

export type MajorNode = {
  majorId: number;
  boardId: number;
  name: string;
  parentId: number | null;
  depth: number;
  displayOrder: number;
};

export type MemberInterest = {
  interestId: number;
};

export type InterestNode = {
  interestId: number;
  boardId: number;
  name: string;
  category: string;
  parentId: number | null;
  displayOrder: number;
};

export type BlockedMember = {
  memberId: number;
  nickname: string;
  universityId: number;
  universityName: string;
  universityBadgeImageUrl: string | null;
  profileImageUrl: string | null;
  blockedAt: string;
};

export type CommentAuthor = {
  memberId: number | null;
  nickname: string;
  profileImageUrl: string | null;
};

export type Comment = {
  commentId: number;
  postId: number;
  parentCommentId: number | null;
  depth: number;
  content: string;
  status: string;
  isAnonymous: boolean;
  isMine: boolean;
  likedByMe: boolean;
  blockedAuthor: boolean;
  likeCount: number;
  replyCount: number;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
};

export type CommentPage = {
  comments: Comment[];
  offset: number;
  limit: number;
  hasNext: boolean;
};

export type GroupRole = {
  groupRoleId: number;
  title: string;
  displayOrder: number;
};

export type GroupMember = {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
  role: string;
  customTitleId: number | null;
  customTitle: string | null;
  joinedAt: string;
  isMe: boolean;
};

export type RecruitmentPosition = {
  name: string;
  count: number;
};

export type RecruitmentFormItem = {
  formItemId?: number;
  question: string;
  questionType: string;
  isRequired: boolean;
  options: string[];
  displayOrder: number;
};

export type RecruitmentSummary = {
  recruitmentId: number;
  groupId: number;
  title: string;
  positions: RecruitmentPosition[];
  deadline: string;
  status: string;
  applicationCount: number;
  createdAt: string;
};

export type RecruitmentDetail = RecruitmentSummary & {
  authorId: number;
  authorNickname: string;
  description: string;
  requirements: string;
  duration: string;
  goal: string;
  processDescription: string;
  formItems: RecruitmentFormItem[];
  updatedAt: string;
};

export type RecruitmentListPage = {
  recruitments: RecruitmentSummary[];
  page: number;
  size: number;
  hasNext: boolean;
};

export type RecruitmentApplicationAnswer = {
  formItemId: number;
  question: string;
  answer: string;
};

export type RecruitmentApplication = {
  applicationId: number;
  recruitmentId: number;
  groupId: number;
  recruitmentTitle: string;
  applicantId: number;
  applicantNickname: string;
  applicantProfileImageUrl: string | null;
  position: string;
  portfolioUrl: string | null;
  status: string;
  reviewedBy: number | null;
  reviewerNickname: string | null;
  reviewedAt: string | null;
  latestReviewNote: string | null;
  answers: RecruitmentApplicationAnswer[];
  createdAt: string;
  updatedAt: string;
};

export type RecruitmentApplicationListPage = {
  applications: RecruitmentApplication[];
  page: number;
  size: number;
  hasNext: boolean;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchApi(path, init);
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload) {
    throw new ApiError(payload?.message || `Request failed with status ${response.status}`, response.status);
  }

  return payload.data;
}

export function formatRelativeTime(value: string) {
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) {
    return value;
  }

  const diff = target - Date.now();
  const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ];

  for (const [unit, size] of units) {
    if (Math.abs(diff) >= size || unit === 'minute') {
      return rtf.format(Math.round(diff / size), unit);
    }
  }

  return '방금 전';
}

export function mapPostCard(post: FeedPost) {
  return {
    id: post.postId,
    title: post.title,
    excerpt: post.contentPreview || post.content || '',
    authorNickname: post.author.nickname,
    schoolName: post.board.name,
    timeAgo: formatRelativeTime(post.createdAt),
    views: post.viewCount,
    likes: post.likeCount,
    comments: post.commentCount,
    category: post.category,
    isAnonymous: post.isAnonymous,
  };
}

export const cluverseApi = {
  login(email: string, password: string) {
    return request<AuthMember>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register(input: {
    email: string;
    password: string;
    nickname: string;
    universityId: number;
    agreedTermsIds: number[];
  }) {
    return request<AuthMember>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  exchangeOauthToken(token: string) {
    return request<AuthMember>(`/api/v1/auth/oauth/token?token=${encodeURIComponent(token)}`, {
      method: 'POST',
    });
  },
  logout() {
    return request<null>('/api/v1/auth/logout', { method: 'POST' });
  },
  getMyProfile() {
    return request<Profile>('/api/v1/members/me/profile');
  },
  updateMyProfile(input: Partial<Profile>) {
    return request<Profile>('/api/v1/members/me/profile', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
  getMyMajors() {
    return request<MemberMajor[]>('/api/v1/members/me/majors');
  },
  addMajor(majorId: number, majorType: string) {
    return request<MemberMajor>('/api/v1/members/me/majors', {
      method: 'POST',
      body: JSON.stringify({ majorId, majorType }),
    });
  },
  deleteMajor(memberMajorId: number) {
    return request<null>(`/api/v1/members/me/majors/${memberMajorId}`, { method: 'DELETE' });
  },
  getMyInterests() {
    return request<MemberInterest[]>('/api/v1/members/me/interests');
  },
  getMajors(parentMajorId?: number) {
    const params = new URLSearchParams();
    if (parentMajorId !== undefined) {
      params.set('parentMajorId', String(parentMajorId));
    }
    const query = params.toString();
    return request<MajorNode[]>(`/api/v1/majors${query ? `?${query}` : ''}`);
  },
  getInterests() {
    return request<InterestNode[]>('/api/v1/interests');
  },
  addInterest(interestId: number) {
    return request<MemberInterest>('/api/v1/members/me/interests', {
      method: 'POST',
      body: JSON.stringify({ interestId }),
    });
  },
  deleteInterest(interestId: number) {
    return request<null>(`/api/v1/members/me/interests/${interestId}`, { method: 'DELETE' });
  },
  getBlockedMembers() {
    return request<BlockedMember[]>('/api/v1/members/me/blocks');
  },
  unblockMember(memberId: number) {
    return request<null>(`/api/v1/members/${memberId}/block`, { method: 'DELETE' });
  },
  searchUniversities(keyword: string) {
    return request<University[]>(`/api/v1/universities?keyword=${encodeURIComponent(keyword)}`);
  },
  getTerms() {
    return request<Term[]>('/api/v1/terms');
  },
  getHomeFeed(filter = 'ALL', limit = 20, cursor?: string) {
    const params = new URLSearchParams({ filter, limit: String(limit) });
    if (cursor) {
      params.set('cursor', cursor);
    }
    return request<CursorPage<FeedPost>>(`/api/v1/feeds/home?${params.toString()}`);
  },
  getFollowingFeed(scope = 'ALL', limit = 20, cursor?: string) {
    const params = new URLSearchParams({ scope, limit: String(limit) });
    if (cursor) {
      params.set('cursor', cursor);
    }
    return request<CursorPage<FeedPost>>(`/api/v1/feeds/following?${params.toString()}`);
  },
  getTrendingPosts(range = 'DAY_7', category?: string, limit = 20, cursor?: string) {
    const params = new URLSearchParams({ range, limit: String(limit) });
    if (category && category !== 'ALL') {
      params.set('category', category);
    }
    if (cursor) {
      params.set('cursor', cursor);
    }
    return request<CursorPage<FeedPost>>(`/api/v1/posts/trending?${params.toString()}`);
  },
  getPosts(input: { boardId: number; sort?: string; page?: number; size?: number }) {
    const params = new URLSearchParams({
      boardId: String(input.boardId),
      sort: input.sort || 'LATEST',
      page: String(input.page || 1),
      size: String(input.size || 20),
    });
    return request<{ posts: FeedPost[]; page: number; size: number; totalElements: number; totalPages: number }>(
      `/api/v1/posts?${params.toString()}`,
    );
  },
  createPost(input: {
    boardId: number;
    category: string;
    title: string;
    content: string;
    tags: string[];
    isAnonymous: boolean;
    isPinned: boolean;
    isExternalVisible: boolean;
    imageUrls: string[];
  }) {
    return request<FeedPost>('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getPost(postId: number) {
    return request<FeedPost>(`/api/v1/posts/${postId}`);
  },
  bookmarkPost(postId: number) {
    return request<null>(`/api/v1/posts/${postId}/bookmarks`, { method: 'POST' });
  },
  unbookmarkPost(postId: number) {
    return request<null>(`/api/v1/posts/${postId}/bookmarks`, { method: 'DELETE' });
  },
  likePost(postId: number) {
    return request<{ postId: number; liked: boolean }>(`/api/v1/posts/${postId}/likes`, { method: 'POST' });
  },
  unlikePost(postId: number) {
    return request<{ postId: number; liked: boolean }>(`/api/v1/posts/${postId}/likes`, { method: 'DELETE' });
  },
  getBoards(input: { type?: string; keyword?: string; parentBoardId?: number; depth?: number; activeOnly?: boolean }) {
    const params = new URLSearchParams();
    if (input.type) {
      params.set('type', input.type);
    }
    if (input.keyword) {
      params.set('keyword', input.keyword);
    }
    if (input.parentBoardId !== undefined) {
      params.set('parentBoardId', String(input.parentBoardId));
    }
    if (input.depth !== undefined) {
      params.set('depth', String(input.depth));
    }
    if (input.activeOnly !== undefined) {
      params.set('activeOnly', String(input.activeOnly));
    }
    return request<{ boards: Array<BoardRef & { description: string; childCount: number; isReadable: boolean; isWritable: boolean; isMemberOnly: boolean }> }>(
      `/api/v1/boards?${params.toString()}`,
    );
  },
  getBoard(boardId: number) {
    return request<BoardDetail>(`/api/v1/boards/${boardId}`);
  },
  getGroups(input?: { keyword?: string; category?: string; activityType?: string; region?: string; visibility?: string; recruitableOnly?: boolean; page?: number; size?: number }) {
    const params = new URLSearchParams();
    if (input?.keyword) {
      params.set('keyword', input.keyword);
    }
    if (input?.category) {
      params.set('category', input.category);
    }
    if (input?.activityType) {
      params.set('activityType', input.activityType);
    }
    if (input?.region) {
      params.set('region', input.region);
    }
    if (input?.visibility) {
      params.set('visibility', input.visibility);
    }
    if (input?.recruitableOnly !== undefined) {
      params.set('recruitableOnly', String(input.recruitableOnly));
    }
    params.set('page', String(input?.page || 1));
    params.set('size', String(input?.size || 20));
    return request<{ groups: GroupSummary[]; page: number; size: number; hasNext: boolean }>(
      `/api/v1/groups?${params.toString()}`,
    );
  },
  getMyGroups() {
    return request<GroupSummary[]>('/api/v1/groups/me');
  },
  getGroup(groupId: number) {
    return request<GroupDetail>(`/api/v1/groups/${groupId}`);
  },
  getGroupMembers(groupId: number) {
    return request<GroupMember[]>(`/api/v1/groups/${groupId}/members`);
  },
  updateGroupMember(groupId: number, memberId: number, input: { role: string; customTitleId: number | null; reason: string }) {
    return request<GroupMember>(`/api/v1/groups/${groupId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  transferGroupOwner(groupId: number, input: { newOwnerMemberId: number; reason: string }) {
    return request<GroupDetail>(`/api/v1/groups/${groupId}/owner-transfer`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getGroupRoles(groupId: number) {
    return request<GroupRole[]>(`/api/v1/groups/${groupId}/roles`);
  },
  createGroupRole(groupId: number, input: { title: string; displayOrder: number }) {
    return request<GroupRole>(`/api/v1/groups/${groupId}/roles`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateGroupRole(groupId: number, roleId: number, input: { title: string; displayOrder: number }) {
    return request<GroupRole>(`/api/v1/groups/${groupId}/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
  deleteGroupRole(groupId: number, roleId: number) {
    return request<null>(`/api/v1/groups/${groupId}/roles/${roleId}`, { method: 'DELETE' });
  },
  getComments(input: { postId: number; parentCommentId?: number; offset?: number; limit?: number }) {
    const params = new URLSearchParams({
      postId: String(input.postId),
      offset: String(input.offset ?? 0),
      limit: String(input.limit ?? 20),
    });
    if (input.parentCommentId !== undefined) {
      params.set('parentCommentId', String(input.parentCommentId));
    }
    return request<CommentPage>(`/api/v1/comments?${params.toString()}`);
  },
  createComment(postId: number, input: { parentCommentId: number | null; content: string; isAnonymous: boolean }) {
    return request<Comment>(`/api/v1/comments?postId=${postId}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  deleteComment(commentId: number) {
    return request<{ postId: number; commentId: number; status: string }>(`/api/v1/comments/${commentId}`, { method: 'DELETE' });
  },
  likeComment(commentId: number) {
    return request<{ postId: number; commentId: number; liked: boolean }>(`/api/v1/comments/${commentId}/likes`, { method: 'POST' });
  },
  unlikeComment(commentId: number) {
    return request<{ postId: number; commentId: number; liked: boolean }>(`/api/v1/comments/${commentId}/likes`, { method: 'DELETE' });
  },
  getRecruitments(input: { groupId: number; status?: string; recruitingOnly?: boolean; page?: number; size?: number }) {
    const params = new URLSearchParams({
      groupId: String(input.groupId),
      page: String(input.page ?? 1),
      size: String(input.size ?? 20),
    });
    if (input.status) {
      params.set('status', input.status);
    }
    if (input.recruitingOnly !== undefined) {
      params.set('recruitingOnly', String(input.recruitingOnly));
    }
    return request<RecruitmentListPage>(`/api/v1/recruitments?${params.toString()}`);
  },
  createRecruitment(groupId: number, input: {
    title: string;
    description: string;
    positions: RecruitmentPosition[];
    requirements: string;
    duration: string;
    goal: string;
    processDescription: string;
    deadline: string;
    formItems: RecruitmentFormItem[];
  }) {
    return request<RecruitmentDetail>(`/api/v1/recruitments?groupId=${groupId}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getRecruitment(recruitmentId: number) {
    return request<RecruitmentDetail>(`/api/v1/recruitments/${recruitmentId}`);
  },
  getRecruitmentApplications(recruitmentId: number, input?: { status?: string; page?: number; size?: number }) {
    const params = new URLSearchParams({
      page: String(input?.page ?? 1),
      size: String(input?.size ?? 20),
    });
    if (input?.status && input.status !== 'ALL') {
      params.set('status', input.status);
    }
    return request<RecruitmentApplicationListPage>(
      `/api/v1/recruitments/${recruitmentId}/applications?${params.toString()}`,
    );
  },
  createRecruitmentApplication(recruitmentId: number, input: {
    position: string;
    portfolioUrl: string | null;
    answers: Array<{ formItemId: number; answer: string }>;
  }) {
    return request<RecruitmentApplication>(`/api/v1/recruitments/${recruitmentId}/applications`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getRecruitmentApplication(recruitmentId: number, applicationId: number) {
    return request<RecruitmentApplication>(`/api/v1/recruitments/${recruitmentId}/applications/${applicationId}`);
  },
  updateRecruitmentApplicationStatus(recruitmentId: number, applicationId: number, input: { status: string; note: string }) {
    return request<RecruitmentApplication>(
      `/api/v1/recruitments/${recruitmentId}/applications/${applicationId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(input),
      },
    );
  },
};
