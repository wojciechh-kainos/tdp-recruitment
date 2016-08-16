package domain;

/**
 * Created by radoslawl on 16/08/16.
 */
public class Report {

    private Persons person;
    private Long numberOfInitSlots;
    private Long numberOfFullSlots;
    private Long numberOfAvailableSlots;
    private Long numberOfWastedSlots;

    public Report(Long numberOfInitSlots, Persons person, Long numberOfAvailableSlots, Long numberOfFullSlots, Long numberOfWastedSlots) {
        this.numberOfInitSlots = numberOfInitSlots;
        this.person = person;
        this.numberOfAvailableSlots = numberOfAvailableSlots;
        this.numberOfFullSlots = numberOfFullSlots;
        this.numberOfWastedSlots = numberOfWastedSlots;
    }

    public Long getNumberOfInitSlots() {
        return numberOfInitSlots;
    }

    public void setNumberOfInitSlots(Long numberOfInitSlots) {
        this.numberOfInitSlots = numberOfInitSlots;
    }

    public Persons getPerson() {
        return person;
    }

    public void setPerson(Persons person) {
        this.person = person;
    }

    public Long getNumberOfFullSlots() {
        return numberOfFullSlots;
    }

    public void setNumberOfFullSlots(Long numberOfFullSlots) {
        this.numberOfFullSlots = numberOfFullSlots;
    }

    public Long getNumberOfAvailableSlots() {
        return numberOfAvailableSlots;
    }

    public void setNumberOfAvailableSlots(Long numberOfAvailableSlots) {
        this.numberOfAvailableSlots = numberOfAvailableSlots;
    }

    public Long getNumberOfWastedSlots() {
        return numberOfWastedSlots;
    }

    public void setNumberOfWastedSlots(Long numberOfWastedSlots) {
        this.numberOfWastedSlots = numberOfWastedSlots;
    }
}
