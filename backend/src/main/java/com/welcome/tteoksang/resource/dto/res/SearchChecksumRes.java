package com.welcome.tteoksang.resource.dto.res;

import com.welcome.tteoksang.resource.dto.ResourceChecksum;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchChecksumRes {
    List<ResourceChecksum> checksumList;
}
