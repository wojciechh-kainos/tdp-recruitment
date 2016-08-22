package domain;

public class Report {

    private Person person;
    private Double initHours;
    private Double fullHours;
    private Double availableHours;


    public Report(Person person, Double initHours, Double availableHours, Double fullHours) {
        this.initHours = initHours;
        this.person = person;
        this.availableHours = availableHours;
        this.fullHours = fullHours;
    }

    public Double getInitHours() {
        return initHours;
    }

    public void setInitHours(Double initHours) {
        this.initHours = initHours;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Double getFullHours() {
        return fullHours;
    }

    public void setFullHours(Double fullHours) {
        this.fullHours = fullHours;
    }

    public Double getAvailableHours() {
        return availableHours;
    }

    public void setAvailableHours(Double availableHours) {
        this.availableHours = availableHours;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Report report = (Report) o;

        if (person != null ? !person.equals(report.person) : report.person != null) return false;
        if (initHours != null ? !initHours.equals(report.initHours) : report.initHours != null)
            return false;
        if (fullHours != null ? !fullHours.equals(report.fullHours) : report.fullHours != null)
            return false;
        return availableHours != null ? availableHours.equals(report.availableHours) : report.availableHours == null;

    }

    @Override
    public int hashCode() {
        int result = person != null ? person.hashCode() : 0;
        result = 31 * result + (initHours != null ? initHours.hashCode() : 0);
        result = 31 * result + (fullHours != null ? fullHours.hashCode() : 0);
        result = 31 * result + (availableHours != null ? availableHours.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Report{" +
                "person=" + person +
                ", initHours=" + initHours +
                ", fullHours=" + fullHours +
                ", availableHours=" + availableHours +
                '}';
    }
}
