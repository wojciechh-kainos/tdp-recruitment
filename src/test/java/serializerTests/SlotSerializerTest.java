package serializerTests;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import domain.AvailabilityType;
import domain.Person;
import domain.Slot;
import domain.SlotTime;
import org.junit.Before;
import org.junit.Test;
import serializers.SlotSerializer;

import java.io.IOException;
import java.io.StringWriter;
import java.sql.Date;
import java.text.ParseException;
import java.time.LocalDate;

import static junit.framework.TestCase.assertTrue;

public class SlotSerializerTest {

    private SlotSerializer slotsSerializer;

    private Person person;
    private SlotTime slotTime;
    private AvailabilityType availabilityType;
    private Slot slot;

    private final String EXPECTED_STRING = "{\"id\":2,\"number\":1,\"type\":\"init\",\"day\":\"2009-10-11\"}";

    @Before
    public void setup() throws IOException {
        slotsSerializer = new SlotSerializer();

        person = new Person();

        slotTime = new SlotTime();
        slotTime.setId(new Long(1));

        availabilityType = new AvailabilityType();
        availabilityType.setName("init");

        slot = new Slot();
        slot.setPerson(person);
        slot.setSlotTime(slotTime);
        slot.setType(availabilityType);

    }

    @Test
    public void testSerialize() throws IOException, ParseException {

        Date date = Date.valueOf(LocalDate.parse("2009-10-11"));

        slot.setSlotDate(date);
        slot.setId(new Long(2));

        String string = getSerializedString(slot);

        assertTrue(string != null);
        assertTrue(string.length() > 0);
        assertTrue(string.equals(EXPECTED_STRING));
    }

    private String getSerializedString(Slot slot) throws IOException {
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
