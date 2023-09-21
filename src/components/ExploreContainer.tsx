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
    { name === "meet" ? <>
    <h2 style={{textAlign:"center"}}>Prossimi eventi creati da te</h2>
    <HostAds />
    <h2 style={{textAlign:"center"}}>Prossimi eventi della Community</h2>
    <BulletinBoard /></> : null}
    { name === "publish" ? <AdForm /> : null }
    { name === "rules" ? <>
    <CommunityRules />
    <h2 style={{textAlign:"center"}}>F.A.Q.</h2>
    <FAQPage />
    <h2 style={{textAlign:"center"}}>Chiedi</h2>
    <FeedbackForm /></> : null}

      
    </div>
  );
};

export default ExploreContainer;
