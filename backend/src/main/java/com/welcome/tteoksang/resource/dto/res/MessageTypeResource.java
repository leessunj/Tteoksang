package com.welcome.tteoksang.resource.dto.res;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageTypeResource  implements Serializable {
    String MessageType;
    Integer MessageTypeValue;
}
