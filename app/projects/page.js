'use client';
import { useState } from 'react';
import { FileText, FileSpreadsheet, List, LayoutGrid, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarData = [
  {
    title: 'Strategic Projects',
    sections: ['Vision 2030 Initiatives', 'Infrastructure', 'Sustainability'],
  },
  {
    title: 'Operations',
    sections: ['General', 'Administration', 'Budget', 'Procurement'],
  },
  {
    title: 'Staff Management',
    sections: ['HR Policies', 'Performance Reviews', 'Recruitment'],
  },
];

const documentData = [
  { type: 'excel', name: 'Quarterly_Report_Q1.xlsx', size: '1.2 MB', modified: '01/04/2025', modifiedBy: 'John Doe' },
  { type: 'word', name: 'Executive_Summary.docx', size: '870 KB', modified: '28/03/2025', modifiedBy: 'Jane Smith' },
  { type: 'excel', name: 'Budget_Planning_2025.xlsx', size: '950 KB', modified: '15/03/2025', modifiedBy: 'Ahmed Ali' },
  { type: 'word', name: 'Sustainability_Goals.docx', size: '500 KB', modified: '10/03/2025', modifiedBy: 'Sara Al-Qahtani' },
];

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState('Strategic Projects');
  const [activeSection, setActiveSection] = useState('Vision 2030 Initiatives');
  const [activeTab, setActiveTab] = useState('Files');
  const [viewType, setViewType] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSectionClick = (project, section) => {
    setActiveProject(project);
    setActiveSection(section);
    setActiveTab('Files');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-80 bg-white border-r border-gray-200 shadow-lg relative"
      >
        <nav className="flex-1 overflow-y-auto p-6">
          {sidebarData.map((project, projectIndex) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: projectIndex * 0.1 }}
              className="mb-8"
            >
              <motion.div
                whileHover={{ x: 4 }}
                className="px-4 py-2 font-semibold text-sm text-green-700 flex items-center group cursor-pointer"
              >
                <motion.span
                  className="w-1 h-6 bg-gradient-to-b from-green-700 to-green-500 rounded-full mr-3 transform group-hover:scale-y-110 transition-transform duration-200"
                />
                {project.title}
              </motion.div>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: projectIndex * 0.1 + 0.2 }}
                className="mt-3 space-y-1"
              >
                {project.sections.map((section, sectionIndex) => {
                  const isActive = activeProject === project.title && activeSection === section;
                  return (
                    <motion.li
                      key={section}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (projectIndex * 0.1) + (sectionIndex * 0.05) + 0.3 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSectionClick(project.title, section)}
                      className={`relative px-6 py-3 cursor-pointer text-sm rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md'
                          : 'hover:bg-green-50 text-gray-700'
                      }`}
                    >
                      {section}
                      {isActive && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200"
          >
            <Plus size={18} />
            <span>New Project</span>
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="font-medium">{activeProject}</span>
            <span className="text-gray-400">/</span>
            <span className="text-green-700 font-semibold">{activeSection}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:shadow-lg transition-all duration-200">
              <Plus size={18} />
              <span>New File</span>
            </button>
          </div>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          {/* Tabs */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex space-x-8">
              {['Files', 'Conversations', 'Wiki'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2 font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? 'text-green-700'
                      : 'text-gray-500 hover:text-green-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-700 to-green-500"
                    />
                  )}
                </button>
              ))}
            </div>
            {activeTab === 'Files' && (
              <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-lg">
                <button
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewType === 'list'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-500 hover:text-green-700'
                  }`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewType === 'grid'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-500 hover:text-green-700'
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'Files' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {viewType === 'list' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                          <th className="px-6 py-3 text-left rounded-l-lg">Type</th>
                          <th className="px-6 py-3 text-left">Name</th>
                          <th className="px-6 py-3 text-left">Modified</th>
                          <th className="px-6 py-3 text-left">Modified By</th>
                          <th className="px-6 py-3 text-left rounded-r-lg">Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {documentData.map((doc, idx) => (
                          <motion.tr
                            key={idx}
                            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                            className="group cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              {doc.type === 'excel' ? (
                                <FileSpreadsheet className="text-green-600" size={20} />
                              ) : (
                                <FileText className="text-blue-600" size={20} />
                              )}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">{doc.name}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.modified}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.modifiedBy}</td>
                            <td className="px-6 py-4 text-gray-500">{doc.size}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {documentData.map((doc, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                        className="p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 group cursor-pointer"
                      >
                        <div className="flex flex-col items-center">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
                            {doc.type === 'excel' ? (
                              <FileSpreadsheet className="text-green-600" size={40} />
                            ) : (
                              <FileText className="text-blue-600" size={40} />
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 text-center mb-1">{doc.name}</h3>
                          <p className="text-sm text-gray-500">{doc.size}</p>
                          <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                            <p className="text-xs text-gray-400 text-center">
                              Modified {doc.modified} by {doc.modifiedBy}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Conversations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {['Leadership Discussion', 'Budget Review', 'Team Collaboration'].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{item}</h3>
                    <p className="text-gray-600">Latest updates and discussions about ongoing projects and initiatives.</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Wiki' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {['Executive Portal Guidelines', 'Key Initiatives', 'FAQs'].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{item}</h3>
                    <p className="text-gray-600">Comprehensive documentation and resources for team reference.</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
