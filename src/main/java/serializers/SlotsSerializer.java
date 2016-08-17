package serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import domain.Slots;
import java.io.IOException;

public class SlotsSerializer extends StdSerializer<Slots>{

    public SlotsSerializer(){
        super(Slots.class);
    }

    @Override
    public void serialize(Slots slot, JsonGenerator jgen, SerializerProvider provider) throws IOException {
        jgen.writeStartObject();
        jgen.writeNumberField("id", slot.getId());
        jgen.writeNumberField("number", slot.getSlot().getId());
        jgen.writeStringField("type", slot.getType().getType().toString());
        jgen.writeStringField("person", slot.getPerson().getId().toString());
        jgen.writeEndObject();
    }

}
