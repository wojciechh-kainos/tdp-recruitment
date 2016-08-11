package domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "availability_types")
public class AvailabilityTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AvailabilityTypesEnum type;

    public String getType() { return type.toString(); }

    public void setType(String type) {
        this.type = AvailabilityTypesEnum.valueOf(type);
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
