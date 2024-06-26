package com.welcome.tteoksang.game.dto.result;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tteoksang implements Comparable<Tteoksang>{
    private String userId;
    private Long profitGold;

    @Override
    public int compareTo(Tteoksang t) {
        return t.profitGold.compareTo(this.profitGold);
    }
}
