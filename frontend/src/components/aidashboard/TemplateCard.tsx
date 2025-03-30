
// export default TemplateCard

import React from 'react';
import { TEMPLATE } from './TemplateListSection';
import { Link } from 'react-router-dom';

const TemplateCard = (item: TEMPLATE) => {
  return (
    <Link to={'/aidashboard/content/'+item.slug}>
      <div className="p-5 shadow-md rounded-md border bg-black flex flex-col gap-3 cursor-pointer m-3 hover:scale-105 transition-all">
        <img src={item.icon} alt="icon" width={50} height={50} />
        <h2 className="font-medium text-lg">{item.name}</h2>
        <p className="text-gray-500 line-clamp-1">{item.desc}</p>
      </div>
    </Link>
  );
};

export default TemplateCard;
