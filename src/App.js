import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Resume from "./Resume"

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/:id" element={<Resume/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
