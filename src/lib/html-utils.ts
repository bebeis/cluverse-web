/**
 * HTML 문자열에서 모든 태그를 제거하고 순수 텍스트만 반환합니다.
 * 게시글 목록의 미리보기(excerpt) 등에서 사용합니다.
 */
export function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent ?? div.innerText ?? '';
  }
  // SSR 환경: 정규식으로 태그 제거
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * HTML 문자열에서 img 태그만 제거합니다.
 * 게시글 본문 미리보기 등에서 이미지를 숨길 때 사용합니다.
 */
export function removeImgTags(html: string): string {
  return html.replace(/<img[^>]*>/gi, '');
}
