package serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import domain.Slots;
import java.io.IOException;

public class SlotsSerializer extends StdSerializer<Slots>{

    public SlotsSerializer(){
        this(null);
    }

    public SlotsSerializer(Class<Slots> t){
        super(t);
    }

    @Override
    public void serialize(Slots slot, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonProcessingException{
        jgen.writeStartObject();
        jgen.writeNumberField("id", slot.getId());
        jgen.writeNumberField("number", slot.getSlot().getId());
        jgen.writeStringField("type", slot.getType().getType());
        jgen.writeStringField("day", slot.getSlotsDate().toString());
        jgen.writeEndObject();
    }

}
