import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

import { useStateValue, setPatient, setPatientList, addEntry } from "../state";
import { Diagnosis, Discharge, Entry, Gender, Patient, SickLeave } from "../types";
import { apiBaseUrl } from "../constants";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const style = {
  fontSize: 16,
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};


interface DiagnoseProps {
  diagnosis?: Array<Diagnosis['code']>;
}

interface HealthCheckEntryProps {
  healthCheckRating: number;
  description: string;
  date: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

interface HospitalEntryProps {
  description: string;
  date: string;
  discharge: Discharge;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

interface OccupationalHealtcheckEntryProps {
  employerName: string;
  description: string;
  date: string;
  sickLeave?: SickLeave;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

const HospitalEntry: React.FC<HospitalEntryProps> = (props) => {
  return (
        <div style={style}>
          <h4>{props.date} <Icon name="hospital" size='big' /></h4>
          <div>{props.description}</div>
          <DiagnoseList diagnosis={props?.diagnosisCodes}/>
          <div>Discharge: {props.discharge.date}, {props.discharge.criteria}</div>
        </div>
        );
};

const OccupationalHealtcheckEntry: React.FC<OccupationalHealtcheckEntryProps> = (props) => {
  const leave = (props?.sickLeave) ? `Sickleave: ${props?.sickLeave?.startDate} - ${props?.sickLeave?.endDate}` : ""; 
  return (
    <div style={style}>
      <h4>{props.date} <Icon name="stethoscope" size='big' /> {props.employerName}</h4>
      <div>{props.description}</div>
      <DiagnoseList diagnosis={props?.diagnosisCodes}/>
      <div>{leave}</div>
      
    </div>
    );
};

const HealthCheckEntry: React.FC<HealthCheckEntryProps> = (props) => {
  //const entryData = props.data.hasOwnProperty('healthCheckRating');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let heartColor = "green" as any;
  if (props.healthCheckRating === 1) {
    heartColor = "yellow";
  }
  if (props.healthCheckRating === 2) {
    heartColor = "orange";
  }
  if (props.healthCheckRating === 3) {
    heartColor = "red";
  }
  return (
    <div style={style}>
      <h4>{props.date} <Icon name="doctor" size='big' /></h4>
      <div>{props.description}</div>
      <Icon name="heart" color={heartColor} />
      <DiagnoseList diagnosis={props?.diagnosisCodes}/>
    </div>
    );
};

const DiagnoseList: React.FC<DiagnoseProps> = (props) => {
  const [{ diagnoses } ] = useStateValue();
  return (
    <ul>
          {props.diagnosis?.map(code =>
            <li key={code}>
              {code} {diagnoses[code]?.name}
            </li>)}
        </ul>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntry
                date={entry.date}
                description={entry.description}
                healthCheckRating={entry.healthCheckRating}
                diagnosisCodes={entry?.diagnosisCodes}
                />;
    case "Hospital":
      return <HospitalEntry 
                date={entry.date}
                description={entry.description}
                discharge={entry.discharge}
                diagnosisCodes={entry?.diagnosisCodes}
              />;
    case "OccupationalHealthcare":
      return <OccupationalHealtcheckEntry 
                date={entry.date}
                description={entry.description}
                employerName={entry.employerName}
                sickLeave={entry?.sickLeave} 
                diagnosisCodes={entry?.diagnosisCodes}
                />;
    default:
      return assertNever(entry);
  }
};


const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //const [{ patient }, dispatch] = useStateValue();
  //const [{ patients }, dispatch] = useStateValue();
  const [{ patient, patients }, dispatch ] = useStateValue();
  console.log(patients);
  //const selectedPatient = patients[Number({ id })];
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      console.log(newEntry);
      
      //dispatch({ type: "ADD_ENTRY", payload: patient });
      dispatch(addEntry(patient));
      window.location.reload();
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        console.log(patientListFromApi);
        //dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  React.useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
        console.log(patientListFromApi);
        //dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientList();
  }, [dispatch]);


  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        //dispatch({ type: "SET_PATIENT", payload: patientFromApi });
        dispatch(setPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
    // eslint-disable-next-line
  }, [dispatch]);

  

  //dispatch({ type: "SET_PATIENT", payload: selectedPatient });
  console.log("Statessa:");
  console.log(patient);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let iconName = "genderless" as any;
  if (patient?.gender === Gender.Female) {
    iconName = "venus";
  }
  if (patient?.gender === Gender.Male) {
    iconName = "mars";
  }


  

  //const patient = patients.find(p => p.id === id);

  return (
    <div className="Testi">
      {/* <h2>This is id:s {id} page</h2> */}
      <h3>{patient?.name} <Icon name={iconName} size='big' /></h3>
      <div>ssn:  {patient?.ssn}</div>
      <div>dateOfBirth:  {patient?.dateOfBirth}</div>
      <div>occupation:  {patient?.occupation}</div>
      <div>id:  {patient?.id}</div>
      <h4>entries</h4>
      {patient?.entries.map(entry => 
        <div key={entry.id}>
          {/* {entry.date} {entry.description}
          <ul>
          {entry?.diagnosisCodes?.map(code =>
            <li key={code}>
              {code} {diagnoses[code]?.name}
            </li>)}
        </ul> */}
        <EntryDetails entry={entry} />
        </div>
        
      )}
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
    
  );
};

export default PatientPage;