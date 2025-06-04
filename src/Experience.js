import React, { useEffect, useState } from 'react';
import JsonEditor from './JsonEditor';

const Experience = ({ jsonObject, pathprefix, handleUpdate }) => { 
  const [responsibilities, setResponsibilities] = useState([]); // Holds the responsibilities array
  const skill_key = (pathprefix + ".skills").split('.');
  const skills = skill_key.reduce((acc, key) => acc[key], jsonObject).join(', ');

  const responsibilities_keys = (pathprefix + ".responsibilities").split('.');

  useEffect(() => {
    // Set responsibilities once during mount
    const resolvedResponsibilities = responsibilities_keys.reduce(
      (acc, key) => acc[key],
      jsonObject
    );
    setResponsibilities(resolvedResponsibilities);
  }, [jsonObject]);

  const do_rephrase = async () => {
    
    let body_json = {}
    body_json["responsibilities"] = responsibilities
    body_json["skills"] = skills

    try {
      const response = await fetch(`http://localhost:5000/rephrase_responsibilities`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(body_json),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      console.log('Server Response:', result);
      let new_responsibilities = result


      const keys = (pathprefix + ".responsibilities").split('.');
      const updatedJson = { ...jsonObject }; // create a copy
      let temp = updatedJson;

      keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = new_responsibilities; // Update the final value
          } else {
            temp = temp[key];
          }
        });
        

      handleUpdate(updatedJson);
    } catch (error) {
      console.error('Error rephrasing responsibilities:', error);
    }

    
      
  };

  const add_reponsibility = () => {
    const updatedResponsibilities = [...responsibilities, "Placeholder Text"];
    setResponsibilities(updatedResponsibilities);

    const updatedJson = { ...jsonObject };
    const keys = (pathprefix + ".responsibilities").split('.');
    let temp = updatedJson;
  
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        temp[key] = updatedResponsibilities; // Ensure update
      } else {
        temp = temp[key];
      }
    });
  
    handleUpdate(updatedJson);
  
  };

  // Define resp_items here to ensure it’s available in the return statement
  const resp_items = responsibilities
    ? responsibilities.map((resp, index) => (
      <li key={`${pathprefix}.responsibilities.${index}-${resp}`}>
          <JsonEditor
            jsonObject={jsonObject}
            path={pathprefix + ".responsibilities." + index}
            onUpdate={handleUpdate}
            highlight={skills}
          />
        </li>
      ))
    : null;

  return (
    <div className="bounding-rectangle">
      <h3>
        <JsonEditor
          jsonObject={jsonObject}
          path={pathprefix + ".company"}
          onUpdate={handleUpdate}
        />{" "}
        --{" "}
        <JsonEditor
          jsonObject={jsonObject}
          path={pathprefix + ".position"}
          onUpdate={handleUpdate}
        />
      </h3>
      <p>
        <JsonEditor
          jsonObject={jsonObject}
          path={pathprefix + ".location"}
          onUpdate={handleUpdate}
        />{" "}
        --{" "}
        <JsonEditor
          jsonObject={jsonObject}
          path={pathprefix + ".dates"}
          onUpdate={handleUpdate}
        />
      </p>
      <ul>{resp_items}</ul>
      <p> 
        <button onClick={add_reponsibility} className='material-button'>Add Responsibility</button>
        <button onClick={do_rephrase} className='material-button'>Rephrase</button> 
        <span className='padded'>Skills: {skills}</span>
      </p>
    </div>
  );
};

export default Experience;