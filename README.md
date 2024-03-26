<br>14조 김국현 - [과제]특강 신청하기/br>

## 데이터베이스 스키마

해당 프로젝트는 다음 두 개의 주요 엔티티를 가지고 있습니다:

### 특별강의(SpecialLecture)
- `아이디(id)`: 특별강의의 고유 식별자 (기본 키)
- `제목(title)`: 특별강의의 제목
- `특별강의 예약 리스트(specialLectureReservations)`: 이 특별강의에 대한 예약 리스트

### 특별강의 예약(SpecialLectureReservation)
- `아이디(id)`: 예약의 고유 식별자 (기본 키)
- `사용자 아이디(userId)`: 예약을 한 사용자의 식별자
- `특별강의(specialLecture)`: 예약이 이루어진 특별강의 (외래 키)

`특별강의(SpecialLecture)`와 `특별강의 예약(SpecialLectureReservation)` 사이에는 일대다 관계가 있습니다. 이는 하나의 `특별강의`가 여러 `특별강의 예약`을 가질 수 있다는 것을 의미합니다.