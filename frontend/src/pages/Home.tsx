import React, { useState } from "react";
import Layout from "../components/aidashboard/Layout";
import SearchSection from "../components/aidashboard/SearchSection";
import TemplateListSection from "../components/aidashboard/TemplateListSection";

const Home = () => {
  const [userSearchInput, setUserSearchInput] = useState<string>("");

  return (
    <Layout>
      {/* Search section */}
      <SearchSection
        onSearchInput={(value: string) => setUserSearchInput(value)}
      />

      {/* Template list section */}
      <TemplateListSection userSearchInput={userSearchInput} />
    </Layout>
  );
};

export default Home;
