

"use client";
import Templates from '@/components/aidashboard/Templates';
import React, { useEffect, useState } from 'react';
import TemplateCard from './TemplateCard';

export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category: string;
  slug: string;
  aiprompt: string;
  form?: FORM[];
}
export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
}

const TemplateListSection = ({ userSearchInput }: any) => {
  const [templateList, setTemplateList] = useState<TEMPLATE[]>([]);

  useEffect(() => {
    if (userSearchInput) {
      const filteredData = Templates.filter(item =>
        item.name.toLowerCase().includes(userSearchInput.toLowerCase())
      );
      setTemplateList(filteredData);
    } else {
      setTemplateList(Templates);
    }
  }, [userSearchInput]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-10 m-5">
      {templateList.map((item: TEMPLATE, index: number) => (
        <TemplateCard {...item} key={index} />
      ))}
    </div>
  );
};

export default TemplateListSection;
