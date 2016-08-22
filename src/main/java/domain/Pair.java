package domain;


import java.io.Serializable;
import java.util.List;

public class Pair implements Serializable {
    private Person searchPerson;
    private Person matchPerson;
    private List<Slot> searchSlots;
    private List<Slot> matchSlots;

    public Pair(){
    }

    public Pair(Person searchPerson, Person matchPerson, List<Slot> searchSlots, List<Slot> matchSlots) {
        this.searchPerson = searchPerson;
        this.matchPerson = matchPerson;
        this.searchSlots = searchSlots;
        this.matchSlots = matchSlots;
    }

    public Person getSearchPerson() {
        return searchPerson;
    }

    public void setSearchPerson(Person searchPerson) {
        this.searchPerson = searchPerson;
    }

    public Person getMatchPerson() {
        return matchPerson;
    }

    public void setMatchPerson(Person matchPerson) {
        this.matchPerson = matchPerson;
    }

    public List<Slot> getSearchSlots() {
        return searchSlots;
    }

    public void setSearchSlots(List<Slot> searchSlots) {
        this.searchSlots = searchSlots;
    }

    public List<Slot> getMatchSlots() {
        return matchSlots;
    }

    public void setMatchSlots(List<Slot> matchSlots) {
        this.matchSlots = matchSlots;
    }
}
