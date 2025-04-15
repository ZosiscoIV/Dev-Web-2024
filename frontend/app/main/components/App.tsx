// app/main/components/App.tsx

"use client";

import Header from './Header';
import Home from "@/app/main/pages/Home";

function App() {
    return (
        <div>
            <Header />
            <main>
                <Home />
            </main>
        </div>
    );
}

export default App;
