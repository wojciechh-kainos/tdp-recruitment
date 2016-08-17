package serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import domain.Slot;
import java.io.IOException;

public class SlotSerializer extends StdSerializer<Slot>{

    public SlotSerializer(){
        super(Slot.class);
    }

    @Override
    public void serialize(Slot slot, JsonGenerator jgen, SerializerProvider provider) throws IOException {
        jgen.writeStartObject();
        jgen.writeNumberField("id", slot.getId());
        jgen.writeNumberField("number", slot.getSlot().getId());
        jgen.writeStringField("type", slot.getType().getName());
        jgen.writeStringField("day", slot.getSlotDate().toString());
        jgen.writeEndObject();
    }

}
