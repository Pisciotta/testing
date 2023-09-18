import React, { useEffect } from 'react';
import './ExploreContainer.css';
import Test from './Test';
import { BulletinBoard } from './Bulletin';
import AdForm from './AdForm';
import CommunityRules from './Rules';
import FeedbackForm from './Feedback';
import FAQPage from './Faq';
import { HostAds } from './HostAds';
import { logoutUser } from './foo';


interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {  
  useEffect(() => {
  if(name === "logout"){
    // Logout user
    const logout = async () => {
      await logoutUser();
      // Go to signin page
      window.location.href = "/";
      
    }
    logout();
  }
  }, [name]);


  return (
    <div className="container">
    { name === "test" ? <Test /> : null}
    { name === "meet" ? <BulletinBoard /> : null}
    { name === "publish" ? <AdForm /> : null }
    { name === "rules" ? <CommunityRules /> : null}
    { name === "faq" ? <><FAQPage /><FeedbackForm /></>: null}
    { name === "host" ? <HostAds /> : null}
      
    </div>
  );
};

export default ExploreContainer;
