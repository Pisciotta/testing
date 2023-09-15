import React from 'react';
import './ExploreContainer.css';
import Test from './Test';
import { BulletinBoard } from './Bulletin';
import AdForm from './AdForm';
import CommunityRules from './Rules';
import FeedbackForm from './Feedback';
import FAQPage from './Faq';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {

  return (
    <div className="container">
      
    { name === "test" ? <Test /> : null}
    { name === "meet" ? <BulletinBoard /> : null}
    { name === "publish" ? <AdForm /> : null }
    { name === "rules" ? <CommunityRules /> : null}
    { name === "faq" ? <><FAQPage /><FeedbackForm /></>: null}
      
    </div>
  );
};

export default ExploreContainer;
