# 이 블로그 저장소에서 일할 때

- 글은 조현수 님 목소리(합니다체, "저는 ~습니다")로 씁니다.
- **글을 올리기 전 반드시 `humanize-korean-lite` 스킬로 AI 말투를 다듬습니다**(사용자 지시 2026-10-27). 사실·수치·날짜는 바꾸지 않습니다.
- 올리기 전 확인: 비밀값·개인정보·아직 공개하지 않을 기획이 없는지.
- 글의 `date`가 지금 시각보다 미래면 Jekyll이 글을 빼고 빌드합니다. `+0900` 표기와 함께 지난 시각으로 적습니다.
- main에 바로 푸시하면 GitHub Pages가 1~3분 뒤 https://wh209302.github.io 에 반영합니다.

## 글 머리말
- `category`: `_data/categories.yml`의 id 하나(notebook-rpg 공책 RPG 개발기 / dev-tips 개발 팁·노하우 / ai-work AI와 일하기). 새 분류는 그 파일에 한 줄 + `categories/<id>.md` 한 장.
- `tags`: 3~5개, 이미 있는 태그를 먼저 씁니다.
- `summary`: 목록·검색에 보이는 한 문장.
- 디자인은 `assets/css/site.css`의 색 토큰(밝은·어두운 화면)으로만 바꿉니다. 테마 젬은 쓰지 않습니다(`theme: null`).
- `series`: 이어지는 글이면 `_data/series.yml`의 id(지금은 rpg-weekly 공책 RPG 주간 일지).
- `pin: true`: 첫 화면 "처음 오셨다면 이 글부터"에 올릴 글(세 편까지).
