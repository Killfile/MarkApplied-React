import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Resume.css';
import JsonEditor from './JsonEditor';
import Experience from './Experience';
import Score from './score';
import RephraseButton from './RephraseButton';

const Resume = () => {
    const { id } = useParams();
    const [exp_items, setExpItems] = useState([])
    const [data, setData] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/resume/read/${id}`);
                
                if (response.status === 200) {
                    const data = await response.json(); // Parse JSON if status is 200
                    setData(data); // Update state with fetched data
                } else {
                    console.error(`Error: Received status code ${response.status}`);
                    throw new Error(`Request failed with status ${response.status}`);
                }
            } catch (error) {
                console.error('Fetch error:', error); // Handle fetch or other errors
            }
        };
    
        fetchData(); // Call the async function
    }, []);
    

    //let exp_items = null
    useEffect(() => {
        if (data) {
            setData(data)
            setExpItems(
                data.experience.map((exp, index) =>
                    <div>
                        <Experience jsonObject={data} pathprefix={"experience." + index} handleUpdate={handleUpdate} />
                    </div>
                )
            )
        }
    }, [data]);

    

    const handleUpdate = async (updatedJson) => {
        setData({...updatedJson});
        console.log('Updated JSON:', updatedJson);
   
        try {
            const response = await fetch(`http://localhost:5000/resume/write/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedJson),
            });
            const result = await response.json();
            console.log('Server Response:', result);
        } catch (error) {
            console.error('Error updating server:', error);
            setData({ error: "Failed to load resume data" });
        }
   };

   const old_rephrase_description = async () => {
    const body_json = {};
    try {
      const response = await fetch(`http://localhost:5000/rephrase_summary/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body_json),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      console.log('Server Response:', result);
      const updatedJson = { ...data }; // create a copy
      updatedJson["summary"]["description"] = result
      setData(updatedJson)
    } catch (error) {
      console.error('Error rephrasing responsibilities:', error);
    }

    
      
  };


    return (
        <div> <div className="outer-bounding-rectangle">
            <div className="header-container">
                <h1>{data["company_name"]}: {data["title_name"]}</h1>
                <div className="pdf-download-container">
                    <div>
                    <Score id={id}/>
                    </div>
                    <div>
                    <button className="material-button" onClick={() => window.open(`http://localhost:5000/resume/render_as_pdf/${id}`)}>
                        Download PDF &#x1F4E5;
                    </button>
                    </div>
                </div>
            </div>
            {data.error && 
                <div class="outer-bounding-rectangle">
                    <p className="error">
                        {data.error}
                    </p>
                </div>
            }
            <div className='bounding-rectangle'>
            <h2>Header</h2>
            <p>Name: {data && <JsonEditor jsonObject={data} path="name" onUpdate={handleUpdate} />}</p>
            <p>Title: {data && <JsonEditor jsonObject={data} path="title" onUpdate={handleUpdate} />}</p>
            </div>
            <div className='bounding-rectangle'>
            <h2>Summary</h2>
            <p>Location: {data && <JsonEditor jsonObject={data} path="summary.location" onUpdate={handleUpdate} />}</p>
            <p>Phone: {data && <JsonEditor jsonObject={data} path="summary.phone" onUpdate={handleUpdate} />}</p>
            <p>Email: {data && <JsonEditor jsonObject={data} path="summary.email" onUpdate={handleUpdate} />}</p>
            <p>Linkedin: {data && <JsonEditor jsonObject={data} path="summary.linkedin" onUpdate={handleUpdate} />}</p>
            <p key="summary.description">Description: {data && <JsonEditor jsonObject={data} path="summary.description" onUpdate={handleUpdate} multiline={true} key={Date.now()}/>}</p>
            <p>
            <RephraseButton url={`http://localhost:5000/rephrase_summary/${id}`} onUpdate={(newDescription) => handleUpdate({ ...data, summary: { ...data.summary, description: newDescription } })} />
                </p>
            </div>
            </div>
            <div className="outer-bounding-rectangle">
            <h1>Experience</h1>
            <h2>Primary Experience</h2>
            {exp_items != null ? exp_items : 'Exp Items Is Null'}
            <h2>Secondary Experience</h2>

            <h3>Coral</h3>
            <p>Location: Reston, VA</p>
            <p>Position: Lead Java Developer</p>
            <p>Dates: 03/2009 - 11/2009</p>
            <h4>Responsibilities</h4>

            <ul>

                <li>Built and demonstrated prototype cloud orchestration technology to investors.</li>

                <li>Set and implemented unit-testing standards for development team using JMock and JUnit.</li>

            </ul>

            <h3>SiteVision</h3>
            <p>Location: Roanoke, VA</p>
            <p>Position: Senior Web Developer</p>
            <p>Dates: 04/2008 - 03/2009</p>
            <h4>Responsibilities</h4>

            <ul>

                <li>Extensive use of Javascript/AJAX, JSON, and XML based messaging for asynchronous communications.</li>

                <li>HIPAA compliant database design and PII segregation for healthcare clients.</li>

            </ul>

            <h3>BearingPoint</h3>
            <p>Location: Radford, VA</p>
            <p>Position: Technology Consultant</p>
            <p>Dates: 10/2007 - 04/2008</p>
            <h4>Responsibilities</h4>
            <ul>

                <li>Tested and refactored/rearchitected MS-SQL database application to improve performance by ~400%.</li>

                <li>Held US government “secret” security clearance.</li>

            </ul>

            <h3>Fingertip Marketing</h3>
            <p>Location: Blacksburg, VA</p>
            <p>Position: Sr Web Developer</p>
            <p>Dates: 12/2004 - 10/2007</p>
            <h4>Responsibilities</h4>
            <ul>

                <li>Highly test-oriented LAMP stack development with substantial database architecture responsibilities.</li>

                <li>Implemented a prototype asynchronous Javascript based framework (later replaced with AJAX).</li>

            </ul>
            </div>

            <h1>Education</h1>

            <div>
                <h4>Radford University</h4>
                BS Computer Science -- 2003-2005</div>
            <div>

                <div>
                    <h4>University of Virginia</h4>
                    BA History -- 1997-2002</div>
                <div>


                    <h2>Training</h2>

                    <div>
                        <h4>Management Training</h4>
                        LifeLabs Learning -- </div>
                    <div>

                        <div>
                            <h4>Amp Up Your Leadership</h4>
                            Voltage Consulting -- </div>
                        <div>


                            <h3>Projects</h3>

                            <div>
                                <p><strong>LinkedOut</strong> -- 2024</p>
                                <p>LinkedIn quality of life browser plugin for Chrome/Firefox</p>
                            </div>

                            <div>
                                <p><strong>MarkApplied</strong> -- 2024</p>
                                <p>AI powered job tracker and resume builder (used to generate this resume)</p>
                            </div>

                            <div>
                                <p><strong>Enigma Code Kata</strong> -- 2021</p>
                                <p>TDD teaching tool using WW2 German Enigma codes</p>
                            </div>

                            <div>
                                <p><strong>Coke and Strippers Cybersecurity</strong> -- 2019</p>
                                <p>Hardware hacking proof-of-concepts</p>
                            </div>

                            <div>
                                <p><strong>Newsvine Citizen Journalism</strong> -- 2006 - 2013</p>
                                <p>Award winning current events and politics content syndicated by MSNBC</p>
                            </div>

                        </div></div></div></div>
        </div>


    );

};

export default Resume;