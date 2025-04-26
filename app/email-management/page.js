'use client'
import React, { useState } from 'react';
import { 
  MailIcon, 
  SendIcon, 
  Send, 
  SquareCheckBig, 
  Search, 
  Plus, 
  Star, 
  StarFilled,
  Trash2,
  Archive,
  Tag,
  Filter,
  ChevronDown,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  Bell,
  BellOff,
  Pin,
  PinFilled,
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Users,
  FolderKanban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@chakra-ui/react';

const inboxEmails = [
  {
    id: 1,
    subject: 'Welcome to the RCRC Executive Portal',
    from: 'admin@rcrc.gov.sa',
    time: '10:45 AM',
    content: `
      <p>Dear Executive,</p>
      <p>Welcome to the <strong>RCRC Executive Portal</strong> demo. This platform is designed to streamline your access to project dashboards, reports, and decision-making tools. Please explore the interface.</p>
      <p>Regards,<br/>Digital Transformation Team.</p>
    `,
  },
  {
    id: 2,
    subject: 'Your Weekly Activity Digest',
    from: 'noreply@rcrc.gov.sa',
    time: '09:15 AM',
    content: `
      <p>Hello,</p>
      <p>Here is your <strong>weekly activity summary</strong> from the Executive Portal. It includes updates on project tracking, meeting outcomes, and key action items requiring your review.</p>
      <p>Best regards,<br/>RCRC Digital Office.</p>
    `,
  },
  {
    id: 5,
    subject: 'New Features Released',
    from: 'updates@rcrc.gov.sa',
    time: '08:00 AM',
    content: `
      <p>Dear User,</p>
      <p>We have released new features on the Executive Portal, including:</p>
      <ul class="list-disc pl-6">
        <li>Enhanced Dashboard Filters</li>
        <li>Real-time KPI Monitoring</li>
        <li>Mobile Responsive Updates</li>
      </ul>
      <p>Visit the <a href="https://demo.rcrc.gov.sa/features" class="text-indigo-600 underline">features page</a> to learn more.</p>
      <p>Thank you,<br/>Digital Transformation Office</p>
    `,
  },
];

const sentEmails = [
  {
    id: 3,
    subject: 'Follow-Up: Executive Portal Demo Walkthrough',
    from: 'you@rcrc.gov.sa',
    time: 'Yesterday',
    content: `
      <p>Dear Leadership Team,</p>
      <p>Following our walkthrough session, the demo portal access has been shared with all key stakeholders. Please share your feedback by <strong>end of this week</strong>.</p>
      <p>Regards,<br/>Mohammad</p>
    `,
  },
  {
    id: 4,
    subject: 'Demo Portal Access Credentials',
    from: 'you@rcrc.gov.sa',
    time: '2 days ago',
    content: `
      <p>Dear Executive,</p>
      <p><strong>Portal Credentials:</strong></p>
      <p>🔹 <strong>URL</strong>: <a href="https://demo.rcrc.gov.sa" class="text-indigo-600 underline">https://demo.rcrc.gov.sa</a><br/>
      🔹 <strong>Username</strong>: Mohammad.tubishat@pwc.com<br/>
      🔹 <strong>Password</strong>: Demo@1234</p>
      <p><em>Note:</em> This demo is for internal review only. Kindly do not share credentials externally.</p>
      <p>Regards,<br/>Mohammad Tubishat.</p>
    `,
  },
  {
    id: 6,
    subject: 'Reminder: Executive Meeting Tomorrow',
    from: 'you@rcrc.gov.sa',
    time: '3 days ago',
    content: `
      <p>Dear All,</p>
      <p>This is a reminder for the <strong>Executive Committee Meeting</strong> scheduled for <strong>tomorrow at 10:00 AM</strong> in the main conference hall.</p>
      <p>Agenda includes:</p>
      <ol class="list-decimal pl-6">
        <li>Review of current projects</li>
        <li>Upcoming initiatives</li>
        <li>Risk management strategies</li>
      </ol>
      <p>Best Regards,<br/>Mohammad Tubishat</p>
    `,
  },
];

export default function EmailManagementPage() {
  const [currentFolder, setCurrentFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState(inboxEmails[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [starredEmails, setStarredEmails] = useState(new Set());
  const [pinnedEmails, setPinnedEmails] = useState(new Set());
  const [isComposing, setIsComposing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const currentEmails = currentFolder === 'Inbox' ? inboxEmails : sentEmails;

  const handleConvertToTask = () => {
    alert(`Email converted to a task: "${selectedEmail?.subject}"`);
  };

  const handleSendToTarasol = () => {
    alert(`Email sent to Tarasol: "${selectedEmail?.subject}"`);
  };

  const toggleStar = (emailId) => {
    const newStarred = new Set(starredEmails);
    if (newStarred.has(emailId)) {
      newStarred.delete(emailId);
    } else {
      newStarred.add(emailId);
    }
    setStarredEmails(newStarred);
  };

  const togglePin = (emailId) => {
    const newPinned = new Set(pinnedEmails);
    if (newPinned.has(emailId)) {
      newPinned.delete(emailId);
    } else {
      newPinned.add(emailId);
    }
    setPinnedEmails(newPinned);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col font-sans bg-gray-50"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b sticky top-0 z-50"
      >
        <div className="flex items-center space-x-6">
          <Button 
            variant="ghost" 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MailIcon size={20} className="text-gray-600" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Email Center
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-96"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            leftIcon={<Plus size={14} />} 
            onClick={() => setIsComposing(true)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            New Email
          </Button>
          <Button 
            leftIcon={<SquareCheckBig size={14} />} 
            onClick={handleConvertToTask} 
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Convert to Task
          </Button>
          <Button 
            leftIcon={<Send size={14} />} 
            onClick={handleSendToTarasol} 
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Send to Tarasol
          </Button>
        </div>
      </motion.header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-72 bg-white border-r p-6"
            >
              <div className="mb-8">
                <Button 
                  leftIcon={<Plus size={14} />} 
                  onClick={() => setIsComposing(true)}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  New Email
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Folders</h2>
                  <ul className="space-y-1">
                    <motion.li
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setCurrentFolder('Inbox');
                        setSelectedEmail(inboxEmails[0]);
                      }}
                      className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                        currentFolder === 'Inbox' 
                          ? 'bg-green-50 text-green-700 font-semibold' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <MailIcon size={18} /> 
                      <span>Inbox</span>
                      <span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {inboxEmails.length}
                      </span>
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        setCurrentFolder('Sent');
                        setSelectedEmail(sentEmails[0]);
                      }}
                      className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                        currentFolder === 'Sent' 
                          ? 'bg-green-50 text-green-700 font-semibold' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <SendIcon size={18} /> 
                      <span>Sent</span>
                      <span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {sentEmails.length}
                      </span>
                    </motion.li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" leftIcon={<FileText size={14} />} className="justify-start hover:bg-gray-50">
                      Drafts
                    </Button>
                    <Button variant="ghost" leftIcon={<Calendar size={14} />} className="justify-start hover:bg-gray-50">
                      Calendar
                    </Button>
                    <Button variant="ghost" leftIcon={<Users size={14} />} className="justify-start hover:bg-gray-50">
                      Contacts
                    </Button>
                    <Button variant="ghost" leftIcon={<FolderKanban size={14} />} className="justify-start hover:bg-gray-50">
                      Tasks
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Email List */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 bg-white overflow-y-auto"
        >
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-800">{currentFolder}</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <Filter size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                  <Tag size={16} />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                <Archive size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <div className="divide-y">
            <AnimatePresence>
              {(currentEmails ?? []).map((email) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedEmail?.id === email.id 
                      ? 'bg-green-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex flex-col items-center space-y-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(email.id);
                        }}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                      >
                        {starredEmails.has(email.id) ? (
                          <StarFilled size={18} className="text-yellow-400" />
                        ) : (
                          <Star size={18} />
                        )}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(email.id);
                        }}
                        className="text-gray-400 hover:text-green-400 transition-colors"
                      >
                        {pinnedEmails.has(email.id) ? (
                          <PinFilled size={18} className="text-green-400" />
                        ) : (
                          <Pin size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold truncate">{email.subject}</span>
                          {pinnedEmails.has(email.id) && (
                            <PinFilled size={14} className="text-green-400" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{email.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 truncate">{email.from}</p>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="xs" className="hover:bg-gray-50">
                            <Reply size={14} />
                          </Button>
                          <Button variant="ghost" size="xs" className="hover:bg-gray-50">
                            <MoreVertical size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Email Content */}
        <AnimatePresence>
          {selectedEmail && (
            <motion.section 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-1/2 bg-white overflow-y-auto border-l"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedEmail.subject}</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                      <Reply size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                      <ReplyAll size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                      <Forward size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {selectedEmail.from.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedEmail.from}</p>
                      <p className="text-xs text-gray-500">to me</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{selectedEmail.time}</span>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-50">
                      <Clock size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose max-w-none p-6 text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
