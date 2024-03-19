package com.welcome.tteoksang.resource.dto.req;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchAchievementResourceReq {
    List<AchievementResource> achievementList;
}
