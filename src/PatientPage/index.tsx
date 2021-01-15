import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { useStateValue, setPatient } from "../state";
import { Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";


const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //const [{ patient }, dispatch] = useStateValue();
  //const [{ patients }, dispatch] = useStateValue();
  const [{ patient }, dispatch ] = useStateValue();
  //const selectedPatient = patients[Number({ id })];
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
          {entry.date} {entry.description}
          <ul>
          {entry?.diagnosisCodes?.map(code =>
            <li>
              {code}
            </li>)}
        </ul>
        </div>
        

      )}
    </div>
  );
};

export default PatientPage;