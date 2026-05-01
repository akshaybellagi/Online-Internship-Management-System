'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import { BookOpen, Video, FileText, Link as LinkIcon, Code, Presentation, ExternalLink, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';

interface Material {
  id: number;
  internship_id: number;
  internship_title: string;
  title: string;
  description: string;
  type: string;
  external_url: string;
  order_index: number;
  is_mandatory: boolean;
  progress_percentage: number;
  is_completed: boolean;
}

interface GroupedMaterials {
  [internshipId: number]: {
    internship_title: string;
    materials: Material[];
  };
}

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/student/materials');
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (materialId: number, progress: number) => {
    try {
      await fetch('/api/student/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: materialId,
          progress_percentage: progress
        })
      });
      fetchMaterials(); // Refresh to show updated progress
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleMarkComplete = (materialId: number) => {
    updateProgress(materialId, 100);
  };

  const handleMarkInProgress = (materialId: number) => {
    updateProgress(materialId, 50);
  };

  // Group materials by internship
  const groupedMaterials: GroupedMaterials = materials.reduce((acc, material) => {
    if (!acc[material.internship_id]) {
      acc[material.internship_id] = {
        internship_title: material.internship_title,
        materials: []
      };
    }
    acc[material.internship_id].materials.push(material);
    return acc;
  }, {} as GroupedMaterials);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={18} className="text-red-600" />;
      case 'document':
        return <FileText size={18} className="text-blue-600" />;
      case 'link':
        return <LinkIcon size={18} className="text-green-600" />;
      case 'code':
        return <Code size={18} className="text-purple-600" />;
      case 'presentation':
        return <Presentation size={18} className="text-orange-600" />;
      default:
        return <BookOpen size={18} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'document':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'link':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'code':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'presentation':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Calculate overall statistics
  const totalMaterials = materials.length;
  const completedMaterials = materials.filter(m => m.is_completed).length;
  const overallProgress = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;
  const mandatoryMaterials = materials.filter(m => m.is_mandatory).length;
  const completedMandatory = materials.filter(m => m.is_mandatory && m.is_completed).length;

  return (
    <div>
      <PageHeader
        title="Learning Materials"
        subtitle="Access course materials and resources for your internships"
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : Object.keys(groupedMaterials).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={40} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Materials Yet</h3>
          <p className="text-gray-600 mb-1">Materials will appear here once you're enrolled in an internship</p>
          <p className="text-sm text-gray-500">Check back after your application is approved</p>
        </div>
      ) : (
        <>
          {/* Overall Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <BookOpen size={24} className="opacity-80" />
                <span className="text-3xl font-bold">{totalMaterials}</span>
              </div>
              <p className="text-indigo-100 text-sm font-medium">Total Materials</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle size={24} className="opacity-80" />
                <span className="text-3xl font-bold">{completedMaterials}</span>
              </div>
              <p className="text-emerald-100 text-sm font-medium">Completed</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={24} className="opacity-80" />
                <span className="text-3xl font-bold">{overallProgress}%</span>
              </div>
              <p className="text-purple-100 text-sm font-medium">Overall Progress</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Award size={24} className="opacity-80" />
                <span className="text-3xl font-bold">{completedMandatory}/{mandatoryMaterials}</span>
              </div>
              <p className="text-orange-100 text-sm font-medium">Mandatory Done</p>
            </div>
          </div>
          <div className="space-y-8">
            {Object.entries(groupedMaterials).map(([internshipId, group]) => {
              const groupCompleted = group.materials.filter((m: Material) => m.is_completed).length;
              const groupProgress = Math.round((groupCompleted / group.materials.length) * 100);
              
              return (
                <div key={internshipId} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Internship Header */}
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{group.internship_title}</h2>
                        <p className="text-indigo-100 text-sm">
                          {group.materials.length} material{group.materials.length !== 1 ? 's' : ''} • {groupCompleted} completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{groupProgress}%</div>
                        <div className="text-indigo-100 text-xs">Progress</div>
                      </div>
                    </div>
                    {/* Mini Progress Bar */}
                    <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${groupProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Materials List */}
                  <div className="divide-y divide-gray-100">
                    {group.materials.map((material: Material, index: number) => (
                      <div key={material.id} className="p-6 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all group">
                        <div className="flex items-start gap-4">
                          {/* Order Number with Icon */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                              material.is_completed 
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
                                : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700'
                            }`}>
                              {material.is_completed ? <CheckCircle size={24} /> : index + 1}
                            </div>
                          </div>

                          {/* Material Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {material.title}
                                  </h3>
                                  {material.is_mandatory && (
                                    <Badge text="Required" className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0" />
                                  )}
                                  {material.is_completed && (
                                    <Badge text="✓ Done" className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0" />
                                  )}
                                </div>
                                {material.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed">{material.description}</p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                                  {getTypeIcon(material.type)}
                                  <span className="text-sm font-medium text-gray-700 capitalize">{material.type}</span>
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {material.progress_percentage > 0 && (
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                                  <span className="flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    Progress
                                  </span>
                                  <span className={material.is_completed ? 'text-emerald-600' : 'text-indigo-600'}>
                                    {material.progress_percentage}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                  <div
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                      material.is_completed 
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                    }`}
                                    style={{ width: `${material.progress_percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                              <a
                                href={material.external_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                              >
                                <ExternalLink size={16} />
                                Open Material
                              </a>

                              {!material.is_completed && (
                                <>
                                  <button
                                    onClick={() => handleMarkInProgress(material.id)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                                  >
                                    <Clock size={16} />
                                    In Progress
                                  </button>
                                  <button
                                    onClick={() => handleMarkComplete(material.id)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                                  >
                                    <CheckCircle size={16} />
                                    Complete
                                  </button>
                                </>
                              )}

                              {material.is_completed && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg text-sm font-semibold shadow-md">
                                  <CheckCircle size={16} />
                                  Completed ✓
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {groupCompleted} / {group.materials.length} Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-orange-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {group.materials.filter((m: Material) => m.is_mandatory).length} Required
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{groupProgress}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
