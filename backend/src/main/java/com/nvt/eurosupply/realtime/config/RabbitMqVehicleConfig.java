package com.nvt.eurosupply.realtime.config;

import com.nvt.eurosupply.realtime.util.SafeMessagePropertiesConverter;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqVehicleConfig {

    @Bean
    public TopicExchange vehicleHeartbeatExchange() {
        return new TopicExchange("vehicle.heartbeat", true, false);
    }

    @Bean
    public TopicExchange vehicleLocationExchange() {
        return new TopicExchange("vehicle.location", true, false);
    }

    @Bean
    public Queue vehicleHeartbeatQueue() {
        return new Queue("vehicle.heartbeat.queue", true);
    }

    @Bean
    public Queue vehicleLocationQueue() {
        return new Queue("vehicle.location.queue", true);
    }

    @Bean
    public Binding heartbeatBinding(Queue vehicleHeartbeatQueue,
                                    TopicExchange vehicleHeartbeatExchange) {
        return BindingBuilder
                .bind(vehicleHeartbeatQueue)
                .to(vehicleHeartbeatExchange)
                .with("vehicle.*.heartbeat");
    }

    @Bean
    public Binding locationBinding(Queue vehicleLocationQueue,
                                   TopicExchange vehicleLocationExchange) {
        return BindingBuilder
                .bind(vehicleLocationQueue)
                .to(vehicleLocationExchange)
                .with("vehicle.*.location");
    }

}
