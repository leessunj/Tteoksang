create table if not exists profile_frame
(
    profile_frame_id   tinyint unsigned primary key auto_increment,
    profile_frame_name varchar(90) not null
);

insert into profile_frame(profile_frame_name)
VALUES ("없음"),
       ("판타지 숲"),
       ("숲"),
       ("16bit"),
       ("동물의 숲"),
       ("네온1"),
       ("네온2"),
       ("네온3");
