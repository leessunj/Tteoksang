package com.welcome.tteoksang.game.repository;

import com.welcome.tteoksang.game.dto.ProductFluctuation;
import com.welcome.tteoksang.game.dto.ProductFluctuationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductFluctuationRepository extends JpaRepository<ProductFluctuation, ProductFluctuationId> {
    List<ProductFluctuation> findByProductId(Integer productId);
}
