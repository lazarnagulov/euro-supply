package com.nvt.eurosupply.realtime.services;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.function.Function;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class InfluxQueryService {

    private final InfluxDBClient influxDbClient;

    @Value("${influxdb.bucket}")
    private String bucket;

    public <T> Stream<T> query(String fluxQuery, Function<FluxRecord, T> mapper) {
        QueryApi queryApi = influxDbClient.getQueryApi();
        return queryApi.query(fluxQuery)
                .stream()
                .flatMap(t -> t.getRecords().stream())
                .map(mapper);
    }
}
