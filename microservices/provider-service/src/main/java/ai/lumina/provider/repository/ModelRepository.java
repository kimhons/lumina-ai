package ai.lumina.provider.repository;

import ai.lumina.provider.model.Model;
import ai.lumina.provider.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Model entity operations
 */
@Repository
public interface ModelRepository extends JpaRepository<Model, String> {

    /**
     * Find models by provider
     * 
     * @param provider The provider
     * @return List of models for the specified provider
     */
    List<Model> findByProvider(Provider provider);
    
    /**
     * Find models by provider ID
     * 
     * @param providerId The provider ID
     * @return List of models for the specified provider
     */
    List<Model> findByProviderId(String providerId);
    
    /**
     * Find models by type
     * 
     * @param type The model type
     * @return List of models of the specified type
     */
    List<Model> findByType(Model.ModelType type);
    
    /**
     * Find enabled models
     * 
     * @return List of enabled models
     */
    List<Model> findByEnabledTrue();
    
    /**
     * Find enabled models by provider
     * 
     * @param provider The provider
     * @return List of enabled models for the specified provider
     */
    List<Model> findByProviderAndEnabledTrue(Provider provider);
    
    /**
     * Find enabled models by provider ID
     * 
     * @param providerId The provider ID
     * @return List of enabled models for the specified provider
     */
    List<Model> findByProviderIdAndEnabledTrue(String providerId);
    
    /**
     * Find enabled models by type
     * 
     * @param type The model type
     * @return List of enabled models of the specified type
     */
    List<Model> findByTypeAndEnabledTrue(Model.ModelType type);
    
    /**
     * Find models by provider and type
     * 
     * @param provider The provider
     * @param type The model type
     * @return List of models for the specified provider and type
     */
    List<Model> findByProviderAndType(Provider provider, Model.ModelType type);
    
    /**
     * Find enabled models by provider and type
     * 
     * @param provider The provider
     * @param type The model type
     * @return List of enabled models for the specified provider and type
     */
    List<Model> findByProviderAndTypeAndEnabledTrue(Provider provider, Model.ModelType type);
    
    /**
     * Find models by context window size greater than or equal to specified value
     * 
     * @param contextWindow The minimum context window size
     * @return List of models with context window size greater than or equal to specified value
     */
    List<Model> findByContextWindowGreaterThanEqual(int contextWindow);
    
    /**
     * Find models ordered by quality score (highest first)
     * 
     * @return List of models ordered by quality score
     */
    List<Model> findAllByOrderByQualityScoreDesc();
    
    /**
     * Find enabled models ordered by quality score (highest first)
     * 
     * @return List of enabled models ordered by quality score
     */
    List<Model> findByEnabledTrueOrderByQualityScoreDesc();
    
    /**
     * Find models by type ordered by quality score (highest first)
     * 
     * @param type The model type
     * @return List of models of the specified type ordered by quality score
     */
    List<Model> findByTypeOrderByQualityScoreDesc(Model.ModelType type);
    
    /**
     * Find enabled models by type ordered by quality score (highest first)
     * 
     * @param type The model type
     * @return List of enabled models of the specified type ordered by quality score
     */
    List<Model> findByTypeAndEnabledTrueOrderByQualityScoreDesc(Model.ModelType type);
    
    /**
     * Find models by cost per token less than specified value
     * 
     * @param cost The maximum cost per token
     * @return List of models with cost per token less than specified value
     */
    @Query("SELECT m FROM Model m WHERE (m.inputCostPer1kTokens + m.outputCostPer1kTokens) / 2 < :cost")
    List<Model> findByAverageCostLessThan(@Param("cost") double cost);
}
