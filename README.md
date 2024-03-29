![image](https://github.com/hanghae-plus-backend/gukhyeon-special-lecture/assets/57578975/944d64fa-bcc4-479a-af0f-bf2167c7e456)<br>14조 김국현 - [과제]특강 신청하기

## 데이터베이스 스키마

해당 프로젝트는 다음 세 개의 주요 엔티티를 가지고 있습니다:

### 강의(Lecture)
- `아이디(id)`: 강의의 고유 식별자 (기본 키)
- `제목(title)`: 강의의 제목
- `시간테이블 리스트(lectureTimeTables)`: 이 강의에 대한 시간 리스트

## 시간테이블(LectureTimeTable)
- `아이디(id)`: 시간테이블의 고유 식별자 (기본 키)
- `강의 (lecture)` : 강의 아이디 고유 식별자 ( 외래 키)
- `시작시간 (startTime)` : 강의 시작 시간
- `종료시간 (endTime)` : 강의 종료 시간
- `강의예약 리스트(lectureReservations)` : 이 강의에 대한 예약 리스트

### 강의 예약(LectureReservation)
- `아이디(id)`: 예약의 고유 식별자 (기본 키)
- `사용자 아이디(userId)`: 예약을 한 사용자의 식별자
- `시간테이블(lectureTimeTable)`: 예약이 이루어진 강의시간테이블 (외래 키)

![image](https://github.com/hanghae-plus-backend/gukhyeon-special-lecture/assets/57578975/2e871f1c-9aa6-475f-827d-20bca33d4c18)
