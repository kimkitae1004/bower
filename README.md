#Bower

1. https://nodejs.org 에서 Node LTS Windows Installer(.msi)를 다운로드하여 설치
------------------------------------------ Node CLI를 이용할 경우 ---------------------------------------------------------------------------------------
2. 설치가 끝나면 Node.js Command prompt 를 윈도우시작 버튼의 검색창을 이용하여 찾아 실행
3. d:\ex4\bower로 이동 -> d: 엔터, cd ex4 엔터, md bower 엔터, cd bower
4. node -v
----------------------------------------- git bash를 이용할 경우 -----------------------------------------------------------------------------------------
5. git bash를 실행
6. cd d: 엔터, cd ex4 엔터, mkdir bower 엔터, cd bower 엔터
7. git init
8. touch README.md
9. 편집기를 이용하여 README.md를 작성하고, 저장
----------------------------------------------------------------------------------------------------------------------------------
10. 노드 버전 보기 -> node -v
11. 노드 도움말 보기 -> node -h
12. Bower 설치 -> npm install -g bower
      Bower 삭제 -> npm uninstall bower
13. Bower 플러그인 설치 -> bower install 플러그인이름
	install 옵션 : -F(충돌시 가장 최신 버전을 강제로 설치), -p(프로젝트 종속성을 설치하지 않음), -S(bower.json에 종속관계로 저장), -D(설치된 프로젝트의 bower.json의 devDependencies항목에 저장), -E(semver버전 보다 정확한 버전으로 설치)
      Bower 플러그인 삭제 -> bower uninstall 플러그인이름
      	ex) bower install jquery
      Bower 도움말 -> bower -h
      bower.json 작성 -> bower init
      종속성 관리 -> bower install 플러그인이름 --save-dev
      ex) bower install jquery --save-dev
      ex) bower install bootstrap jquery-ui --save-dev
14. Bower API
      bower 캐시 관리 -> bower cache 명령 [아그먼트]
	ex) bower cache list
	ex) bower cache clean
      bower 도움말 -> bower help
      기본 브라우저에서 패키지 홈페이지 열기 -> bower home
      패키지 정보 보기 -> bower info
      bower 링크 생성 -> bower link
      bower 로컬 패키지 및 가능한 업데이트 목록 보기 -> bower list
      bower 패키지 URL 검색 -> bower lookup
      github에 저장된 자격 증명을 사용하여 인증 -> bower login
      로컬에 있는 필요없는 패키지를 제거 -> bower prune
      패키지를 등록 -> bower register
      모든 패키지 또는 특정 패키지 찾기 -> bower search
      bower 패키지 업데이트 -> bower update
      패키지 등록 해제 -> bower unregister
      버전 확인 -> bower version
15. 프로그래밍 API
      var bower = require('bower');
      bower.commands.install(['jquery'], { save : true }, { }).on('end', function (installed) { console.log(installed); });
      bower.commands.search('jquery' , { }).on('end', function (results) { console.log(results); });
      /* log : 명령의 상태/진행을 보고하기 위해 발생되는 이벤트 
         prompt : 사용자가 프롬프트창에 입력할 때 마다 발생되는 이벤트
         error : 뭔가 잘못된 일이 있을 경우에만 발생되는 이벤트
         end : 명령이 성공적으로 종료되었을 때 발생되는 이벶트
      */
      var inquirer = require('inquirer');
      bower.commands.install(['jquery'], { save : true }, { interactive : true }).on('prompt', function ( prompts, callback) { inquirer.prompt(prompts, callback); });

16. .bowerrc 환경 설정
      directory : 플러그인의 위치
      cwd : 현재 작업하는 디렉토리
      그 밖의 사항은 https://github.com/bower/spec/blob/master/config.md에서 확인할 것.
      환경 설정의 우선 순위
	1) CLI 매개변수로 인한 환경설정 --config 명령어
	2) 환경변수
	3) 현재 작업디렉토리에 있는 .bowerrc 파일
	4) 상위 렉토리에 있는 .bowerrc 파일
	5) 사용자의 홈디렉토리에 있는 .bowerrc 파일
	6) 전역 지역에 있는 폴더(/)에 있는 .bowerrc 파일

17. 패키지 등록하기
      1) github에 bower 레포시토리를 만듦.(만들때 Initialize this repository with a README 를 체크)
      2) git bash를 실행합니다.
      3) d:\ex4\bower 폴더를 만듦.
      4) cd d: 엔터, cd ex4 엔터, cd bower 엔터 로 해당 디렉토리로 이동
      5) git clone 레포시토리주소
      6) README.md 파일을 수정
      7) bower.json파일 만듦. -> bower init
      8) 만든 jquery 플러그인을 d:\ex4\bower 폴더에 복사하여 붙여넣기
      9) 관리할 폴더및파일을 추가 -> git add .
      10) 커밋메시지를 입력하고 커밋 -> git commit -m "메시지"
      11) git remote add origin 해당git의repository주소
      12) git push origin master
       또는 git push 해당git의repository주소
      13) bower register 패키지이름 해당git의repository주소
       ex) bower register bower https://github.com/kimkitae1004/bower.git