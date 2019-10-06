package org.gold.stratego.database.entities;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;

@Document(collection="mongotest")
public class MongoTest{

    public static class ObjectTest{
         private String value;
         private int number;

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public int getNumber() {
            return number;
        }

        public void setNumber(int number) {
            this.number = number;
        }
    }

    @Id
    private String id;
    private String name;
    private ObjectTest ot;

    public ObjectTest getOt() {
        return ot;
    }

    public void setOt(ObjectTest ot) {
        this.ot = ot;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}