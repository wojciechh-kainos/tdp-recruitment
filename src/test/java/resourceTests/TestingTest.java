package resourceTests;

import static io.dropwizard.testing.FixtureHelpers.*;
import static org.assertj.core.api.Assertions.assertThat;

import domain.Persons;
import domain.Slots;
import io.dropwizard.jackson.Jackson;
import org.junit.Test;
import com.fasterxml.jackson.databind.ObjectMapper;

public class TestingTest {

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();

    //just an example.

    @Test
    public void deserializesFromJSON() throws Exception {
//        final Persons person = MAPPER.readValue(fixture("fixtures/persons.json"), Persons.class);

        final Slots slot = MAPPER.readValue(fixture("fixtures/slots.json"), Slots.class);


        System.out.println(slot.getType());


        assertThat(1)
                .isEqualTo(1);
    }
}