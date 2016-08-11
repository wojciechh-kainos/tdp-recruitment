package serializerTests;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import domain.AvailabilityTypes;
import domain.Persons;
import domain.Slots;
import domain.SlotsTimes;
import org.junit.Before;
import org.junit.Test;
import serializers.SlotsSerializer;

import java.io.IOException;
import java.io.StringWriter;
import java.sql.Date;
import java.text.ParseException;
import java.time.LocalDate;

import static junit.framework.TestCase.assertTrue;

public class SlotsSerializerTest {

    private SlotsSerializer slotsSerializer;

    private Persons person;
    private SlotsTimes slotsTime;
    private AvailabilityTypes availabilityType;
    private Slots slot;

    private final String EXPECTED_STRING = "{\"id\":2,\"number\":1,\"type\":\"init\",\"day\":\"2009-10-11\"}";

    @Before
    public void setup() throws IOException {
        slotsSerializer = new SlotsSerializer();

        person = new Persons();

        slotsTime = new SlotsTimes();
        slotsTime.setId(new Long(1));

        availabilityType = new AvailabilityTypes();
        availabilityType.setType("init");

        slot = new Slots();
        slot.setPerson(person);
        slot.setSlot(slotsTime);
        slot.setType(availabilityType);

    }

    @Test
    public void testSerialize() throws IOException, ParseException {

        Date date = Date.valueOf(LocalDate.parse("2009-10-11"));

        slot.setSlotsDate(date);
        slot.setId(new Long(2));

        String string = getSerializedString(slot);

        assertTrue(string != null);
        assertTrue(string.length() > 0);
        assertTrue(string.equals(EXPECTED_STRING));
    }

    private String getSerializedString(Slots slot) throws IOException {
        StringWriter stringWriter = new StringWriter();

        JsonGenerator jsonGenerator =
                new JsonFactory().createGenerator(stringWriter);

        slotsSerializer.serialize(slot, jsonGenerator, null);
        jsonGenerator.flush();
        jsonGenerator.close();
        stringWriter.close();

        return stringWriter.toString();
    }
}
