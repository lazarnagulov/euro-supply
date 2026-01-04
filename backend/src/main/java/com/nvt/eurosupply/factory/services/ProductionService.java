package com.nvt.eurosupply.factory.services;

import com.nvt.eurosupply.factory.dtos.ProductionChartDto;
import com.nvt.eurosupply.factory.models.Production;
import com.nvt.eurosupply.factory.repositories.ProductionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.IsoFields;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductionService {
    private final ProductionRepository productionRepository;

    public List<ProductionChartDto> getProduction(
            Long factoryId,
            Long productId,
            Instant from,
            Instant to
    ) {
        List<Production> productions = productionRepository.findByProductIdAndFactoryIdAndProductionDateBetween(
                productId, factoryId, from, to
        );

        long days = java.time.Duration.between(from, to).toDays();

        if (days <= 30) {
            return aggregateByDay(productions);
        } else if (days <= 180) {
            return aggregateByWeek(productions);
        } else {
            return aggregateByMonth(productions);
        }
    }

    private List<ProductionChartDto> aggregateByDay(List<Production> productions) {
        return productions.stream()
                .collect(Collectors.groupingBy(
                        p -> LocalDate.ofInstant(p.getProductionDate(), ZoneOffset.UTC),
                        Collectors.summingInt(Production::getQuantity)
                ))
                .entrySet()
                .stream()
                .map(e -> new ProductionChartDto(e.getKey().toString(), e.getValue()))
                .sorted(Comparator.comparing(ProductionChartDto::time))
                .toList();
    }

    private List<ProductionChartDto> aggregateByWeek(List<Production> productions) {
        return productions.stream()
                .collect(Collectors.groupingBy(
                        p -> {
                            LocalDate d = LocalDate.ofInstant(p.getProductionDate(), ZoneOffset.UTC);
                            int week = d.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
                            return d.getYear() + "-W" + week;
                        },
                        Collectors.summingInt(Production::getQuantity)
                ))
                .entrySet()
                .stream()
                .map(e -> new ProductionChartDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(ProductionChartDto::time))
                .toList();
    }

    private List<ProductionChartDto> aggregateByMonth(List<Production> productions) {
        return productions.stream()
                .collect(Collectors.groupingBy(
                        p -> {
                            LocalDate d = LocalDate.ofInstant(p.getProductionDate(), ZoneOffset.UTC);
                            return d.getYear() + "-" + String.format("%02d", d.getMonthValue());
                        },
                        Collectors.summingInt(Production::getQuantity)
                ))
                .entrySet()
                .stream()
                .map(e -> new ProductionChartDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(ProductionChartDto::time))
                .toList();
    }
}

