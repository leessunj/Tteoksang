package com.welcome.tteoksang.resource.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Title implements Serializable {

    @Id
    @Column(name = "title_id")
    Integer titleId;
    @Column(name = "title_name")
    String titleName;
    @Column(name="title_content")
    String titleContent;
}
